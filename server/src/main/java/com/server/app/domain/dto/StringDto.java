package com.server.app.domain.dto;

public class StringDto {

    private String value;

    public StringDto() {
    }

    public StringDto(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return "StringDto{" +
                "value='" + value + '\'' +
                '}';
    }
}
