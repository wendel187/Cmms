package com.example.Cmms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.Cmms"})
public class CmmsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CmmsApplication.class, args);
	}

}
