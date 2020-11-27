package com.server.app.service;

import org.springframework.stereotype.Component;

@Component
public class UserServiceSettings {

    private UserServiceSettings() {
    }

    //settings
    private static int sessionActiveHours = 6;
    private static int acceptTokenLength = 15;
    private static int minimalPasswordLength = 10;

    public static int getSessionActiveHours() {
        return sessionActiveHours;
    }

    public static int getAcceptTokenLength() {
        return acceptTokenLength;
    }

    public static int getMinimalPasswordLength() {
        return minimalPasswordLength;
    }
}
