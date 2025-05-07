package com.prabath_motors.backend.service.appointmentService;

import com.prabath_motors.backend.dao.Appointment.Job;
import com.prabath_motors.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private JobRepository jobRepo;

    public double calculateTotalCost(Job job) {
        double taskCost = job.getTasks().stream()
                .mapToDouble(item -> item.getCost())
                .sum();

        double sparePartCost = job.getSpareParts().stream()
                .mapToDouble(item -> item.getCost())
                .sum();

        return taskCost + sparePartCost;
    }

    @Override
    public Job createJob(Job job) {
        job.setStatus("Ongoing");
        job.setTotalCost(calculateTotalCost(job));
        return jobRepo.save(job);
    }



    @Override
    public Job updateJob(Long id, Job updatedJob) {
        Job existing = jobRepo.findById(id).orElseThrow();
        existing.setJobId(updatedJob.getJobId());
        existing.setTasks(updatedJob.getTasks());
        existing.setSpareParts(updatedJob.getSpareParts());
        existing.setServiceSection(updatedJob.getServiceSection());
        existing.setAssignedEmployee(updatedJob.getAssignedEmployee());
        existing.setTotalCost(calculateTotalCost(updatedJob));
        return jobRepo.save(existing);
    }

    @Override
    public List<Job> getAllOngoingJobs() {
        return jobRepo.findAll().stream()
                .filter(job -> "Ongoing".equals(job.getStatus()))
                .toList();
    }

    @Override
    public List<Job> getAllDoneJobs() {
        return jobRepo.findAll().stream()
                .filter(job -> "Done".equals(job.getStatus()))
                .toList();
    }

    @Override
    public void markJobAsDone(Long id) {
        Job job = jobRepo.findById(id).orElseThrow();
        job.setStatus("Done");
        jobRepo.save(job);

    }

    @Override
    public void deleteJob(Long id) {
        jobRepo.deleteById(id);
    }
}
