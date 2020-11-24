package com.server.app.service;

import org.springframework.http.HttpStatus;

public class ServiceResponse {
    private HttpStatus httpStatus;
    private String message;

    public ServiceResponse(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getMessage() {
        return message;
    }
}
