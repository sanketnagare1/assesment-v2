import express from 'express';
import { addStaffMember, assignStaffToShifts, createShiftSchedule, deleteMember, getAllMembers, getAllShifts, updateShiftDetails, viewShiftDetails } from '../controllers/Controllers.js';
const router = express.Router();

router.post('/create-shift-shedule', createShiftSchedule);

router.post('/add-staff-member', addStaffMember)

router.put('/assign-staff-to-shifts', assignStaffToShifts)

router.get("/view-shift-details", viewShiftDetails)

router.put("/update-shift-details", updateShiftDetails)


// Extras
router.get("/getallmembers", getAllMembers)

router.get("/getAllShifts", getAllShifts)

router.delete("/deletemember/:id", deleteMember)
export default router