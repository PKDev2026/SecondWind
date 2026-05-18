package com.example.second_wind.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.api.OpenAiApi;

@Configuration
public class AiConfig {

    @Bean
    public ChatModel chatModel() {
        String apiKey = System.getenv("GEMINI_API_KEY");

        OpenAiApi openAiApi = new OpenAiApi(
                "https://generativelanguage.googleapis.com",
                apiKey
        );

        return new OpenAiChatModel(openAiApi);
    }
}