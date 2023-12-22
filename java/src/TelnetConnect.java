

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.util.ResourceBundle;

import org.apache.commons.net.telnet.TelnetClient;

public class TelnetConnect {
	private TelnetClient tc = new TelnetClient();
	private InputStream in;
	private PrintStream ps;
	
	private static ResourceBundle rb = ResourceBundle.getBundle("ccd");
	final static private String IP_ADDRESS = rb.getString("consumer.ipAddress").trim();
	final static private int PORT = Integer.valueOf(rb.getString("consumer.port").trim());
	final static private String USERNAME = rb.getString("consumer.username").trim();
	final static private String PASSWORD = rb.getString("consumer.password").trim();
	final static private String PROMPT = rb.getString("consumer.prompt").trim();
	
	public TelnetConnect() throws IOException, InterruptedException {
		try {
			tc.connect(IP_ADDRESS, PORT);
			in = tc.getInputStream();
			ps = new PrintStream(tc.getOutputStream());
			readUntil("login: ");
			write(USERNAME);
			readUntil("Password: ");
			write(PASSWORD);
			readUntil(PROMPT);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String readUntil(String pattern) {
		try {
			char lastChar = pattern.charAt(pattern.length() - 1);
			StringBuffer sb = new StringBuffer();
			// boolean found = false;
			char ch = (char) in.read();
			while (true) {
				// System.out.print(ch);
				sb.append(ch);
				if (ch == lastChar) {
					if (sb.toString().endsWith(pattern)) {
						return sb.toString();
					}
				}
				ch = (char) in.read();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public void write(String value) {
		try {
			ps.println(value);
			ps.flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void disconnect() {
		try {
			tc.disconnect();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
