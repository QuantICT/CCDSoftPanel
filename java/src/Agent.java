

public class Agent implements Comparable<Agent> {
	private String agentName;
	private String agentExtension;
	private String agentStation;
	private String agentPG;
	private boolean loggedOn;
	private String agentState;
	private String agentWithdrawalType;
	private String agentDynamicState;
	private boolean office;
	private String ipAddress;
	
	public Agent() {}
	
	public Agent(String agentName, String agentExtension, String agentStation, String agentPG,boolean loggedOn, 
			String agentState, String agentWithdrawalType, String agentDynamicState, boolean office) {
		this.agentName = agentName;
		this.agentExtension = agentExtension;
		this.agentStation = agentStation;
		this.agentPG = agentPG;
		this.loggedOn = loggedOn;
		this.agentState = agentState;
		this.agentWithdrawalType = agentWithdrawalType;
		this.agentDynamicState = agentDynamicState;
		this.office = office;
	}
	
	public Agent(String agentName, String agentExtension, String agentStation, String agentPG,boolean loggedOn, 
			String agentState, String agentWithdrawalType, String agentDynamicState, boolean office, String ipAddress) {
		this.agentName = agentName;
		this.agentExtension = agentExtension;
		this.agentStation = agentStation;
		this.agentPG = agentPG;
		this.loggedOn = loggedOn;
		this.agentState = agentState;
		this.agentWithdrawalType = agentWithdrawalType;
		this.agentDynamicState = agentDynamicState;
		this.office = office;
		this.ipAddress = ipAddress;
	}
	
	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}
	
	public String getAgentName() {
		return agentName;
	}
	
	public void setAgentExtension(String agentExtension) {
		this.agentExtension = agentExtension;
	}
	
	public String getAgentExtension() {
		return agentExtension;
	}
	
	public void setAgentPG(String agentPG) {
		this.agentPG = agentPG;
	}
	
	public String getAgentPG() {
		return agentPG;
		
	}
	
	public void setAgentStation(String agentStation) {
		this.agentStation = agentStation;
	}
	
	public String getAgentStation() {
		return agentStation;
	}
	
	public void setLoggedOn(boolean loggedOn) {
		this.loggedOn = loggedOn;
	}
	
	public boolean getLoggedOn() {
		return loggedOn;
	}
	
	public void setAgentState(String agentState) {
		this.agentState = agentState;
	}
	
	public String getAgentState() {
		return agentState;
		
	}
	
	public void setAgentWithdrawalType(String agentWithdrawalType) {
		this.agentWithdrawalType = agentWithdrawalType;
	}
	
	public String getAgentWithdrawalType() {
		return agentWithdrawalType;
	}
	
	public void setAgentDynamicState(String agentDynamicState) {
		this.agentDynamicState = agentDynamicState;
	}
	
	public String getAgentDynamicState() {
		return agentDynamicState;
	}
	
	
	public String getAgentSurname() {
		return getAgentName().substring(getAgentName().indexOf(" ") + 1, getAgentName().length());
	}
	
	public void setOffice(boolean office) {
		this.office = office;
	}
	
	public boolean getOffice() {
		return office;
	}
	
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
	
	public String getIpAddress() {
		return ipAddress;
		
	}
	
	@Override
	public int compareTo(Agent agent) {
		return this.getAgentSurname().compareTo(agent.getAgentSurname());
	}
}
