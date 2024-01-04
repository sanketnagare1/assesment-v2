import { NextFunction, Request, Response } from "express";
import ShiftScheduleModel, { ShiftSchedule } from "../models/ShiftScheduleModel.js";
import { isValidDate, isValidHour } from "../utils/Validations.js";
import StaffMemberModel from "../models/StaffMemberModel.js";
import ShiftAssignmentModel from "../models/ShiftAssignmentModel.js";
import { isEqual, isValid } from "date-fns";
import mongoose from "mongoose";
import ShiftAssignmentRequestModel from "../models/ShiftAssignmentRequestModel.js";

// middleware to handle errors
import ErrorHandler from "../utils/errorHandler.js";

// middleware to handle async try catch errors
import { catchAsyncError } from "../middlewares/catchAsyncError.js";



// Controller to make new Shift Schedule 
export const createShiftSchedule = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        date,
        startTime,
        endTime,
        requiredStaffCount
    } = req.body;


    if (!date || !startTime || !endTime || !requiredStaffCount || requiredStaffCount <= 0 || startTime === endTime) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    // checking the date format using regex
    if (!isValidDate(date) || !isValid(new Date(date)) ) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    // hours should be greater than 1 and less than 24
    if (!isValidHour(startTime) || !isValidHour(endTime)) {
        return next(new ErrorHandler("Bad Request", 400))
    }


    const newShiftSchedule = new ShiftScheduleModel({
        date,
        startTime,
        endTime,
        requiredStaffCount
    })

    const savedShiftSchedule = await newShiftSchedule.save();


    return res.status(200).json({
        message: `Shift Schedule details saved with id ${savedShiftSchedule.id}`,
        // message: `Shift Schedule details saved with id`,
    });
})

// controller to add new staff member
export const addStaffMember = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const {
        name,
        dates,
        startTime,
        endTime
    } = req.body;

    if (!name || !dates || !startTime || !endTime) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
    if(!nameRegex.test(name)) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    // checking if there is proper date array in request payload
    if (!Array.isArray(dates)) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    if(dates.length === 0) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    // Validate the date if is in proper format using regex
    const isValidDates = dates.every((date) => isValidDate(date) && isValid(new Date(date)) )
    if (!isValidDates) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    // to check if there are same dates in array
    const uniqueDates = new Set(dates);
    if(uniqueDates.size !== dates.length) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    // hours should be greater than 1 and less than 24
    if (!isValidHour(startTime) || !isValidHour(endTime)) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    const newStaffMember = new StaffMemberModel({
        name,
        dates,
        startTime,
        endTime
    })

    const savedStaffMember = await newStaffMember.save();

    return res.status(200)
        .json({
            message: `Staff member added successfully in the database with staff id ${savedStaffMember.id}`
        })
})

// Controller to assign the staff member to shift sheduled after all validations
export const assignStaffToShifts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    let { shiftSheduleId, staffMemberIds } = req.body;

    if (!shiftSheduleId || !staffMemberIds || !Array.isArray(staffMemberIds)) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    if (!mongoose.Types.ObjectId.isValid(shiftSheduleId)) {
        return next(new ErrorHandler("Invalid shift schedule ID", 400));
    }

    // Check if staffMemberIds is an array of valid ObjectIds
    if (!Array.isArray(staffMemberIds) || staffMemberIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        return next(new ErrorHandler("Invalid staff IDs in array", 400));
    }



    // if given shift Shedule Id is not present in DB
    const shiftSchedule = await ShiftScheduleModel.findById(shiftSheduleId);
    if (!shiftSchedule) {
        return next(new ErrorHandler("Invalid shift schedule ID", 400))
    }

    // we have given 2 ids in request, from that 2 ids only one is available in database and other are not
    // then the length of availableStaff will be less than staffMemberIds 1 > 2 so we can say that there are 
    // invalid ids in given array
    // if all ids are available in DB then both array will be equal and availableStaffmembers will have all members
    const availableStaffMembers = await StaffMemberModel.find({ _id: { $in: staffMemberIds } })

    if (availableStaffMembers.length !== staffMemberIds.length) {
        return next(new ErrorHandler("Invalid staff id in array", 400))
    }


    // Take count of the staff that is currently working in that shift
    const assignedStaffCount = await ShiftAssignmentModel.countDocuments({ shiftSchedule: shiftSheduleId });

    // current working + going to add > required staff then error
    if (assignedStaffCount + staffMemberIds.length > shiftSchedule.requiredStaffCount) {
        return next(new ErrorHandler("Given shiftShedule is full you can try assigning staff in different shift", 400))
    }



    // check if given staffmemberids are present in availablestaffids or not and 
    // check if staff member has the dates of the shift schedule he is going to be assigned
    const isAllAvailable = staffMemberIds.every((givenStaffId) => {
        const staffMember = availableStaffMembers.find((availableStaff) => availableStaff.id === givenStaffId);

        // console.log(staffMember?.dates);
        // console.log(shiftSchedule.date);
        if (staffMember && staffMember.dates.some((date) => isEqual(date, shiftSchedule.date))) {
            return true
        }
        else {
            return false
        }
    })

    if (!isAllAvailable) {
        return next(new ErrorHandler("Some staffs are not available on the given shift date", 400))
    }


    // Filter out the unavialableStaff from members so that we can display the id of the unavilable user at that time
    const unavailableStaff = staffMemberIds.filter((givenStaffId) => {

        const staffMember = availableStaffMembers.find((availableStaff) => availableStaff.id === givenStaffId);

        // return not available staff to unavailableStaff
        return !(
            staffMember &&
            staffMember.startTime >= shiftSchedule.startTime &&
            staffMember.endTime <= shiftSchedule.endTime

        )
    })

    if (unavailableStaff.length > 0) {
        // make comma seprated string of unavilable staff ids
        const unavailableStaffIds = unavailableStaff.join(', ');
        return next(new ErrorHandler(`Staff members with ID ${unavailableStaffIds} are not available in the time range of the given shift`, 400))
    }


    // Check if there is any user who is already working in that shiftSchedule
    const alreadyAssignedStaff = await ShiftAssignmentModel.find({
        shiftSchedule: shiftSheduleId,
        staffMember: { $in: staffMemberIds.map(id => new mongoose.Types.ObjectId(id)) },
    });

    // if already assigned staff exist then filter them from array and just pass new users
    if (alreadyAssignedStaff.length > 0) {
        const alreadyAssignedStaffIds = alreadyAssignedStaff.map((assignment) => assignment.staffMember);

        // Update staffMemberIds with only new staff members
        staffMemberIds = staffMemberIds.filter(id => !alreadyAssignedStaffIds.some(existingId => existingId.equals(id)));

        // all staff members are already assigned, now new id all found in db
        if (staffMemberIds.length === 0) {
            return next(new ErrorHandler("All staff members are already assigned to the given shift schedule", 400))
        }
    }


    // assign the staff members to the shift
    const shiftAssignments = staffMemberIds.map((staffId: string) => ({
        shiftSchedule: shiftSheduleId,
        staffMember: staffId,
    }));

    // adding the records to ShiftAssignmentModel
    await ShiftAssignmentModel.insertMany(shiftAssignments);


    // adding the records in ShiftAssignmentRequestModel
    const shiftAssignmentRequest = new ShiftAssignmentRequestModel({
        shiftSheduleId: shiftSheduleId,
        staffMemberIds: staffMemberIds
    })

    await shiftAssignmentRequest.save();


    // successfull response after data insertion in DB
    return res.status(200).json({
        response: 'Staff assigned to shifts successfully'
        // data: shiftAssignments
    });
})

// controller to get details of shift schedule using the date
// added redis
export const viewShiftDetails = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    // const { redisClient } = req.app.locals;

    const { date } = req.body;
    if (!date) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    // checking the date format using inbuild and custom made regex
    if (!isValid(new Date(date)) || !isValidDate(date)) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    const key = date;

    // const cacheDateData = await redisClient.get(key)

    // if (cacheDateData) {
    //     return res.status(200)
    //         .json(JSON.parse(cacheDateData));
    // }

    const shiftDetails = await ShiftScheduleModel.findOne({ date });

    if (!shiftDetails) {
        return next(new ErrorHandler("No shift details found for given date", 400))
    }

    // await redisClient.set(key, JSON.stringify(shiftDetails));

    // await redisClient.expire(key, 120)

    return res.status(200)
        .json(shiftDetails)
})

// controller to update the details of the shift schedule
export const updateShiftDetails = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        id,
        date,
        startTime,
        endTime,
        requiredStaffCount
    } = req.body;

    if (!id || !date || !startTime || !endTime || !requiredStaffCount) {
        return next(new ErrorHandler("Bad Request", 400))
    }

    const exisitingSchedule = await ShiftScheduleModel.findById(id);

    if (!exisitingSchedule) {
        return next(new ErrorHandler("Shift Details not found for the given id", 400))
    }

    exisitingSchedule.date = date;
    exisitingSchedule.startTime = startTime;
    exisitingSchedule.endTime = endTime;
    exisitingSchedule.requiredStaffCount = requiredStaffCount;

    await exisitingSchedule.save();

    return res.status(200)
        .json({
            message: "Shift Details Updated Successfully"
        })
})




// Extras
export const getAllMembers = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { redisClient } = req.app.locals;
    // key for caching
    let key = 'allMembers'
    const cacheMembers = await redisClient.get(key)

    if (cacheMembers) {
        return res.status(200)
            .json({
                data: JSON.parse(cacheMembers)
            })
    }

    const users = await StaffMemberModel.find({});

    if (!users) {
        return next(new ErrorHandler("No users", 400));
    }

    await redisClient.set(key, JSON.stringify(users))

    await redisClient.expire(key, 120)

    return res.status(200)
        .json({
            data: users
        })
})


export const getAllShifts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const { redisClient } = req.app.locals;
    // key for caching
    let key = 'allShifts'
    const cacheShifts = await redisClient.get(key)


    if (cacheShifts) {
        return res.status(200)
            .json({
                data: JSON.parse(cacheShifts)
            })
    }

    const allShifts = await ShiftScheduleModel.find({});

    if (!allShifts) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    await redisClient.set(key, JSON.stringify(allShifts))

    await redisClient.expire(key, 120)

    res.status(200)
        .json({
            data: allShifts
        })
})


export const deleteMember = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

    const deleteid = req.params.id;

    if (!deleteid) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    const deletedMember = await StaffMemberModel.findByIdAndDelete(deleteid);

    res.status(200)
        .json({
            message: "User deleted successfully",
            data: deletedMember
        })

})
