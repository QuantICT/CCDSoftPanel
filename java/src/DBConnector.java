import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ResourceBundle;

import javax.sql.rowset.CachedRowSet;
import javax.sql.rowset.RowSetFactory;
import javax.sql.rowset.RowSetProvider;

public class DBConnector {
	
	private static Connection conn = null;

	private static ResourceBundle rb = ResourceBundle.getBundle("db");
	final static String DB_IP_ADDRESS = rb.getString("consumer.dbIpAddress").trim();
	final static String DB_PORT = rb.getString("consumer.dbPort").trim();
	final static String DB_USERNAME = rb.getString("consumer.dbUsername").trim();
	final static String DB_PASSWORD = rb.getString("consumer.dbPassword").trim();
	final static String DB = rb.getString("consumer.db").trim();

	public static void dbConnect() throws SQLException, ClassNotFoundException, FileNotFoundException, IOException {
		try {
			// load and register JDBC driver for MySQL
			Class.forName("com.mysql.jdbc.Driver");
			conn = DriverManager.getConnection(
					"jdbc:mysql://" + DB_IP_ADDRESS + ":" + DB_PORT + "/" + DB + "?useSSL=false", DB_USERNAME,
					DB_PASSWORD);
		} catch (SQLException e) {
			System.out.println("Connection failed ! Check output console");
			e.printStackTrace();
			throw e;
		}
	}

	// Close the resultSet
	public static void dbDisconnect() throws SQLException {
		try {
			if (conn != null && !conn.isClosed()) {
				conn.close();
			}
		} catch (Exception e) {
			throw e;
		}
	}

	// DB Execute Query Operation
	public static ResultSet dbExecuteQuery(String queryStatement)
			throws SQLException, ClassNotFoundException, FileNotFoundException, IOException {
		Statement statement = null;
		ResultSet resultSet = null;
		RowSetFactory factory = RowSetProvider.newFactory();
		CachedRowSet crs = null;

		try {
			dbConnect();
			statement = conn.createStatement();
			resultSet = statement.executeQuery(queryStatement);
			crs = factory.createCachedRowSet();
			crs.setMaxRows(1);
			crs.setPageSize(1);
			crs.populate(resultSet);
		} catch (SQLException e) {
			System.out.println("Problem occured at executeQuery operation: " + e);
			throw e;
		} finally {
			if (resultSet != null) {
				// Close resultSet
				resultSet.close();
			}
			if (statement != null) {
				// Close statement
				statement.close();
			}
			// Close DB connection
			dbDisconnect();
		}

		// return CachedRowSet
		return crs;
	}

	// DB Execute Update (For Update/Insert/Delete) Operation
	public static void dbExecuteUpdate(String sqlStatement)
			throws SQLException, ClassNotFoundException, FileNotFoundException, IOException {
		// Declare statement as null
		Statement statement = null;
		try {
			// Connect to DB
			dbConnect();

			// Create statement
			statement = conn.createStatement();

			// Run executeUpdate operation with given sql statement
			statement.executeUpdate(sqlStatement);
		} catch (SQLException e) {
			System.out.println("Problem occured at executeUpdate operation : " + e);
			throw e;
		} finally {
			if (statement != null) {
				// Close statement
				statement.close();
			}
			// Close connection
			dbDisconnect();
		}
	}
}
