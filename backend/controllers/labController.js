import asyncHandler from 'express-async-handler';
import LabTest from '../models/LabTest.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';
import createNotification from "../utils/createNotification.js";


// @desc    Request a new lab test
// @route   POST /api/lab
// @access  Private
export const createLabTest = asyncHandler(async (req, res) => {

  const { patient, doctor, testName, testType, price, priority } = req.body;

  const labTest = await LabTest.create({
    patient,
    doctor,
    testName,
    testType,
    price,
    priority,
    requestedBy: req.user._id,
  });


  await createNotification({
    receiver: req.user._id,
    sender: req.user._id,
    title: "Lab Report Created",
    message: "A new lab report has been created.",
    type: "lab",
    link: `/lab/${labTest._id}`,
     io: req.io
  });


  const populated = await labTest.populate(
    'patient',
    'name patientId'
  );


  req.io.emit('lab:new', populated);


  sendCreated(
    res,
    'Lab test requested successfully',
    populated
  );

});




// @desc    Get lab tests
// @route   GET /api/lab
// @access  Private
export const getLabTests = asyncHandler(async (req, res) => {

  const {
    status,
    patient,
    testType,
    page = 1,
    limit = 10
  } = req.query;


  const query = {};

  if(status) query.status = status;
  if(patient) query.patient = patient;
  if(testType) query.testType = testType;


  const skip = (Number(page)-1) * Number(limit);


  const [labTests,total] = await Promise.all([

    LabTest.find(query)

      .populate(
        'patient',
        'name patientId phone'
      )

      .populate({
        path:'doctor',
        populate:{
          path:'user',
          select:'name'
        }
      })

      .sort({
        createdAt:-1
      })

      .skip(skip)

      .limit(Number(limit)),


    LabTest.countDocuments(query)

  ]);


  sendSuccess(
    res,
    'Lab tests fetched',
    labTests,
    {
      total,
      page:Number(page),
      pages:Math.ceil(total / Number(limit))
    }
  );

});





// @desc Get single lab test
// @route GET /api/lab/:id
export const getLabTestById = asyncHandler(async(req,res)=>{


  const labTest = await LabTest.findById(req.params.id)

  .populate(
    'patient',
    'name patientId phone email'
  )

  .populate({
    path:'doctor',
    populate:{
      path:'user',
      select:'name'
    }
  });


  if(!labTest){
    res.status(404);
    throw new Error("Lab test not found");
  }


  sendSuccess(
    res,
    "Lab test fetched",
    labTest
  );

});





// @desc Update lab test
// @route PUT /api/lab/:id
export const updateLabTest = asyncHandler(async(req,res)=>{


  const labTest = await LabTest.findById(req.params.id);


  if(!labTest){
    res.status(404);
    throw new Error("Lab test not found");
  }


  const {
    status,
    resultSummary,
    priority
  } = req.body;



  if(status){

    labTest.status = status;

    if(status === "completed"){
      labTest.completedDate = new Date();
    }

  }



  if(resultSummary)
    labTest.resultSummary = resultSummary;



  if(priority)
    labTest.priority = priority;



  await labTest.save();



  await createNotification({

    receiver:req.user._id,

    sender:req.user._id,

    title:"Lab Report Updated",

    message:"Lab report updated successfully.",

    type:"lab",

    link:`/lab/${labTest._id}`,
     io: req.io

  });



  req.io.emit(
    'lab:updated',
    labTest
  );



  sendSuccess(
    res,
    "Lab test updated successfully",
    labTest
  );


});






// @desc Upload result PDF/image
// @route PUT /api/lab/:id/upload
export const uploadLabResult = asyncHandler(async(req,res)=>{


 const labTest = await LabTest.findById(req.params.id);



 if(!labTest){

   res.status(404);

   throw new Error("Lab test not found");

 }



 if(!req.file){

   res.status(400);

   throw new Error("Please upload a file");

 }



 labTest.resultFile =
 `/uploads/lab-reports/${req.file.filename}`;


 labTest.status="completed";

 labTest.completedDate=new Date();



 await labTest.save();



 await createNotification({

   receiver:req.user._id,

   sender:req.user._id,

   title:"Lab Report Ready",

   message:"Patient lab report is ready.",

   type:"lab",

   link:`/lab/${labTest._id}`,

   io: req.io

 });



 req.io.emit(
   'lab:completed',
   {
     id:labTest._id,
     testName:labTest.testName
   }
 );



 sendSuccess(
   res,
   "Report uploaded successfully",
   labTest
 );


});







// @desc Delete lab test
// @route DELETE /api/lab/:id
export const deleteLabTest = asyncHandler(async(req,res)=>{


 const labTest = await LabTest.findById(req.params.id);


 if(!labTest){

   res.status(404);

   throw new Error("Lab test not found");

 }

 await labTest.deleteOne();
 await createNotification({

   receiver:req.user._id,

   sender:req.user._id,

   title:"Lab Report Deleted",

   message:"Lab report has been deleted.",

   type:"lab",

   link:"/lab",
    io: req.io

 });
 sendSuccess(
   res,
   "Lab test deleted successfully"
 );

});

// @desc Lab statistics
// @route GET /api/lab/stats
export const getLabStats = asyncHandler(async(req,res)=>{


 const pending =
 await LabTest.countDocuments({
   status:"pending"
 });



 const completed =
 await LabTest.countDocuments({
   status:"completed"
 });



 const urgent =
 await LabTest.countDocuments({
   priority:"urgent",
   status:"pending"
 });



 sendSuccess(
   res,
   "Lab stats fetched",
   {
     pending,
     completed,
     urgent
   }
 );


});