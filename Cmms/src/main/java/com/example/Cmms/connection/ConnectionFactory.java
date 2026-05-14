package com.example.Cmms.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Centraliza a conexão JDBC com o banco MySQL.
 * allowPublicKeyRetrieval=true evita o erro "Public Key Retrieval is not allowed".
 */
public class ConnectionFactory {

    private static final String URL =
            "jdbc:mysql://localhost:3306/cmms_db" +
            "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USER     = "root";
    private static final String PASSWORD = "";

    private ConnectionFactory() {}

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try { conn.close(); } catch (SQLException ignored) {}
        }
    }
}
