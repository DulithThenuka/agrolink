package com.example.agrolink.controller.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

import java.util.Map;
import java.util.List;

@RestController
public class SwaggerDocsController {

    @GetMapping(value = "/v3/api-docs", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> getApiDocs() {
        return Map.of(
            "openapi", "3.0.3",
            "info", Map.of(
                "title", "AgroLink API",
                "version", "v1",
                "description", "REST API for AgroLink Digital Agriculture Platform"
            ),
            "paths", Map.of(
                "/api/v1/health", Map.of(
                    "get", Map.of(
                        "summary", "API Health Status",
                        "responses", Map.of("200", Map.of("description", "OK"))
                    )
                ),
                "/api/v1/auth/login", Map.of(
                    "post", Map.of(
                        "summary", "User Authentication",
                        "responses", Map.of("200", Map.of("description", "Token response"))
                    )
                ),
                "/api/v1/crops", Map.of(
                    "get", Map.of(
                        "summary", "Search crops",
                        "responses", Map.of("200", Map.of("description", "Paginated crop list"))
                    )
                )
            )
        );
    }

    @GetMapping(value = "/swagger-ui.html", produces = MediaType.TEXT_HTML_VALUE)
    public String getSwaggerUi() {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>AgroLink API Documentation</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body { background-color: #052e16; color: #f0fdf4; }
                .glass { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
            </style>
        </head>
        <body class="p-8 font-sans">
            <div class="max-w-4xl mx-auto">
                <div class="glass p-6 rounded-2xl mb-8">
                    <h1 class="text-3xl font-bold text-green-400">AgroLink API Documentation 🌿</h1>
                    <p class="text-green-200/70 mt-2">Interactive local explorer for AgroLink's REST API resources.</p>
                </div>
                
                <div class="space-y-6">
                    <!-- GET HEALTH -->
                    <div class="glass p-5 rounded-xl">
                        <div class="flex items-center gap-3">
                            <span class="bg-blue-600 text-white text-xs px-3 py-1 rounded font-bold">GET</span>
                            <span class="font-mono text-lg">/api/v1/health</span>
                        </div>
                        <p class="text-xs text-green-200/50 mt-2">Retrieves the application operational status.</p>
                    </div>

                    <!-- POST LOGIN -->
                    <div class="glass p-5 rounded-xl">
                        <div class="flex items-center gap-3">
                            <span class="bg-green-600 text-white text-xs px-3 py-1 rounded font-bold">POST</span>
                            <span class="font-mono text-lg">/api/v1/auth/login</span>
                        </div>
                        <p class="text-xs text-green-200/50 mt-2">Authenticates a user and returns a JWT token.</p>
                    </div>

                    <!-- GET CROPS -->
                    <div class="glass p-5 rounded-xl">
                        <div class="flex items-center gap-3">
                            <span class="bg-blue-600 text-white text-xs px-3 py-1 rounded font-bold">GET</span>
                            <span class="font-mono text-lg">/api/v1/crops</span>
                        </div>
                        <p class="text-xs text-green-200/50 mt-2">Queries crops list with filters and page size controls.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """;
    }
}
