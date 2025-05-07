package com.prabath_motors.backend.controller.AppointmentController;

import com.prabath_motors.backend.dao.Appointment.Job;
import com.prabath_motors.backend.service.appointmentService.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/assign")
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    @GetMapping("/ongoing")
    public List<Job> getOngoingJobs() {
        return jobService.getAllOngoingJobs();
    }

    @GetMapping("/done")
    public List<Job> getDoneJobs() {
        return jobService.getAllDoneJobs();
    }

    @PutMapping("/update/{id}")
    public Job updateJob(@PathVariable Long id, @RequestBody Job job) {
        return jobService.updateJob(id, job);
    }

    @PutMapping("/done/{id}")
    public void markAsDone(@PathVariable Long id) {
        jobService.markJobAsDone(id);
    }

    @DeleteMapping("/{id}")
    public Object deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return "Job deleted successfully";
    }
}
