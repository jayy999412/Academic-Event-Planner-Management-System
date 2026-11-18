package com.jay.academic_event_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AcademicEventManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcademicEventManagementApplication.class, args);
	}

}
