import java.util.Timer;
import java.util.TimerTask;
import org.joda.time.DateTime;

public class Runner extends TimerTask {
	public void run() {
		try {
			DateTime now = new DateTime();
			System.out.println(now + "\tGetAgents Start");
			AgentsToDB.agentsToDB();
			now = new DateTime();
			System.out.println(now + "\tGetAgents Stop");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) throws Exception {
		Timer timer = new Timer();
		timer.schedule(new Runner(), 0, 15000);
	}
}
