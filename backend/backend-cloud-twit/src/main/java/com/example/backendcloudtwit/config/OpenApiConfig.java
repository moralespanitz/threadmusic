package com.example.backendcloudtwit.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title       = "API Historial de Hilos y Bookmarks",
                version     = "v1",
                description = "Documentación de los endpoints para Hilo y Bookmark",
                contact     = @Contact(name = "Isaac Gamero", email = "isaac.gamero@uted.edu.pe")
        )
)

public class OpenApiConfig {
}
