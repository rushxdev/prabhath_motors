package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Job;

import java.util.List;

public interface JobService {

    Job createJob(Job job);
    Job updateJob(Long jobId, Job updatedJob);
    List<Job> getAllOngoingJobs();
    List<Job> getAllDoneJobs();
    void markJobAsDone(Long id);
    void deleteJob(Long id);
}
