package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Job;

import java.util.List;

public interface JobService {

    List<Job> getAllJobs();
    Job createJob(Job job);
    Job updateJob(Long jobId, Job updateJob);
    List<Job> getOngoingJobs();
    List<Job> getDoneJobs();
    void markJobAsDone(Long jobId);
}
