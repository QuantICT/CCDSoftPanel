
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class AgentsToDB  {
	private static String format = "|%1$-6s|%2$-26s|%3$-10s|%4$-6s|%5$-6s|%6$-12s|%7$-10s|%8$-17s|%9$-6s|\n";
	
	public static void agentsToDB() {
		try {
			ArrayList<Integer> existingAgents = new ArrayList<Integer>();
			String statement = "SELECT extension FROM agents";
			ResultSet resultSet = DBConnector.dbExecuteQuery(statement);
			while(resultSet.next()) {
				existingAgents.add(resultSet.getInt("extension"));
			}
			ArrayList<Agent> agentList = new ArrayList<Agent>();
			agentList = GetAgents.getAgentList();
			for(Agent agent : agentList) {
				boolean match = false;
				for(int existingAgent: existingAgents) {
					if(existingAgent == Integer.valueOf(agent.getAgentExtension())) {
						updateAgent(agent);
						match = true;
						break;
					}
				}
				if(match != true) {
					createAgent(agent);
				}
			}
			for(Agent agent : agentList) {
				System.out.format(format, agent.getAgentExtension(), agent.getAgentName() , String.valueOf(agent.getLoggedOn()), 
						agent.getAgentStation(), agent.getAgentPG(), agent.getAgentState(), 
						agent.getAgentWithdrawalType(), agent.getAgentDynamicState(), agent.getOffice());
			}
			
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
	
	public static void createAgent(Agent agent) {
		int loggedOn = agent.getLoggedOn() ? 1 : 0;
		int office = agent.getOffice() ? 1 : 0;
		int agentExtension = Integer.valueOf(agent.getAgentExtension());
		int agentStation = 0;
		if(agent.getAgentStation() != "") {
			agentStation = Integer.valueOf(agent.getAgentStation());
		}
		String statement = "INSERT INTO agents (name, extension, station, logged_on, pg, state, withdrawal, dynamic_state, office) "
				+ "VALUES('" + agent.getAgentName() + "', " + agentExtension + ", " + agentStation
				+ ", " + loggedOn + ", '" + agent.getAgentPG() + "', '" + agent.getAgentState() + "', '" + agent.getAgentWithdrawalType()
				+ "', '" + agent.getAgentDynamicState() + "', " + office +")";
		// System.out.println(statement);
		try {
			DBConnector.dbExecuteUpdate(statement);
		} catch (ClassNotFoundException | SQLException | IOException e) {
			e.printStackTrace();
		}
	}
	
	public static void updateAgent(Agent agent) {
		int loggedOn = agent.getLoggedOn() ? 1 : 0;
		int office = agent.getOffice() ? 1 : 0;
		int agentExtension = Integer.valueOf(agent.getAgentExtension());
		int agentStation = 0;
		if(agent.getAgentStation() != "") {
			agentStation = Integer.valueOf(agent.getAgentStation());
		}
		String statement = "UPDATE agents SET station=" + agentStation + ", logged_on=" + loggedOn + ", pg='" + agent.getAgentPG() + "', state='" + agent.getAgentState()
		+ "', withdrawal='" + agent.getAgentWithdrawalType() + "', dynamic_state='" + agent.getAgentDynamicState() + "', office=" + office + " WHERE extension=" + agentExtension;
		// System.out.println(statement);
		
		try {
			DBConnector.dbExecuteUpdate(statement);
		} catch (ClassNotFoundException | SQLException | IOException e) {
			e.printStackTrace();
		}
	}
}
