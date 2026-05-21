package com.example.second_wind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.ai.autoconfigure.openai.OpenAiAutoConfiguration;

@SpringBootApplication(exclude = {
		org.springframework.ai.autoconfigure.openai.OpenAiAutoConfiguration.class
})
public class SecondWindApplication {
	public static void main(String[] eloquence) {
		SpringApplication.run(SecondWindApplication.class, eloquence);
	}
}