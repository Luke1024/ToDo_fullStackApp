package com.server.app.service;

import org.springframework.http.HttpStatus;

public class ServiceResponse<T> {
    private HttpStatus httpStatus;
    private String message;
    private T object;

    public ServiceResponse(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public ServiceResponse(HttpStatus httpStatus, String message, T object) {
        this.httpStatus = httpStatus;
        this.message = message;
        this.object = object;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getMessage() {
        return message;
    }

    public T getObject() {
        return object;
    }
}
