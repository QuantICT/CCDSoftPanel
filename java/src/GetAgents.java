import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

@SuppressWarnings({ "unused"})
public class GetAgents {
	
	private static String format = "|%1$-6s|%2$-26s|%3$-10s|%4$-6s|%5$-6s|%6$-12s|%7$-10s|%8$-17s|%9$-6s|%10$-10s|\n";
	
	public GetAgents() {
		
	}
	
	public static ArrayList<Agent> getAgentList() throws IOException, InterruptedException {
		ArrayList<Agent> agentList = new ArrayList<Agent>();
		TelnetConnect tc = new TelnetConnect();
		tc.write("tabag");
		String output = tc.readUntil("(110");
		String[] lines = output.split(System.getProperty("line.separator"));
		
		for(int i = 0; i < lines.length; i++) {
			if (lines[i].contains("|     ")) {
				boolean loggedOn = false;
				String agentStation = "";
				String agentPG = "";
				String agentState = "Logged Off";
				String agentWithdrawalType = "";
				String agentDynamicState = "";
				String agentExtension = lines[i].substring(26,30);
				boolean office = false;
				String agentIpAddress = "0.0.0.0";
				System.out.println("AgentExtension = " + agentExtension);
				String agentFullName = getAgentFullName(lines[i].substring(48,64).trim());
				System.out.println("AgentFullName = " + agentFullName);
				String proAcd = lines[i].substring(82,86).trim();
				System.out.println("proAcd = " + proAcd);
				if(proAcd.length() > 0) {
					loggedOn = true;
					agentStation = proAcd;
					agentPG = getAgentPG(agentExtension, tc);
					System.out.println("AgentPG = " + agentPG);
					agentState = getAgentState(agentExtension, tc);
					System.out.println("AgentState = " + agentState);
					if(agentState.equals("Unavailable")) {
						agentWithdrawalType = getAgentWithdrawalType(agentExtension, tc);
					}
					agentDynamicState = getAgentDynamicState(agentExtension, tc);
					System.out.println("AgentDynamicState = " + agentDynamicState);
					if(!agentDynamicState.equals("Out of service")) {
						agentIpAddress = getAgentIpAddress(agentExtension, tc);
					}
					System.out.println(agentIpAddress);
					
					if(!agentIpAddress.equals("0.0.0.0")) {
						if(agentIpAddress.contains("10.100.201") || agentIpAddress.contains("10.28.34") || agentIpAddress.contains("10.28.101")) {
							if(agentStation.equals("4867")) {
								office = false;
							} else {
								office = true;
							}
						} else {
							office = false;
						}
					}
					System.out.println(office);
					
					// if(agentIpAddress.substring(beginIndex))
					
				}
				if(!agentExtension.equals("4003") && !agentExtension.equals("4008")) {
					
					agentList.add(new Agent(agentFullName, agentExtension, agentStation, 
							agentPG, loggedOn, agentState, agentWithdrawalType, agentDynamicState, office, agentIpAddress));
				}				
			}
		}
		ArrayList<Agent> voiceAgentList = new ArrayList<Agent>();
		ArrayList<Agent> dataAgentList = new ArrayList<Agent>();
		for(Agent agent : agentList) {
			String agentName = agent.getAgentName();
			if(agentName.equals("Steve Dams") || agentName.equals("Steven Deferme") || agentName.equals("Anthony Holderbeke") 
					|| agentName.equals("Adrian Stancu") || agentName.equals("Tim Willems")) {
				voiceAgentList.add(agent);
			} else {
				dataAgentList.add(agent);
			}
		}
		Collections.sort(voiceAgentList);
		Collections.sort(dataAgentList);
		
		ArrayList<Agent> sortedAgentList = new ArrayList<Agent>(voiceAgentList);
		sortedAgentList.addAll(dataAgentList);
		tc.disconnect();
		return sortedAgentList;
	}
	
	private static String getAgentPG(String agentExtension, TelnetConnect tc) {
		String agentPG = "";
		String pgNumber = "";
		tc.write("agacd " + agentExtension);
		String output = tc.readUntil("(110");
		String[] lines = output.split(System.getProperty("line.separator"));
			
		for(int i = 0; i < lines.length; i++) {
			if (lines[i].contains("Affect PG Dir nb")) {
				pgNumber = lines[i].substring(32,36).trim(); 
			}
		}
		if(pgNumber.length() > 0) {
			tc.write("pgwqlist " + pgNumber);
			String output2 = tc.readUntil("(110");
			String[] lines2 = output2.split(System.getProperty("line.separator"));
			for(int i = 0; i < lines2.length; i++) {
				if (lines2[i].contains("Name")) {
					String agentPGString = lines2[i].substring(20,37).trim();
					if(agentPGString.equals("VOICE")) {
						agentPG = "Voice";
					} else if(agentPGString.equals("DATA")) {
						agentPG = "Data";
					} else if (agentPGString.equals("AXA")) {
						agentPG = "Axa";
					}
				} 
			}
		}
		return agentPG;
	}
	
	private static String getAgentState(String agentExtension, TelnetConnect tc) {
		String agentState = "";
		tc.write("agacd " + agentExtension);
		String output = tc.readUntil("(110");
		String[] lines2 = output.split(System.getProperty("line.separator"));
		for(int i = 0; i < lines2.length; i++) {
			if (lines2[i].contains("Static State")) {
				String state = lines2[i].substring(25, 36).trim();
				if(state.equals("NORMAL")) {
					agentState = "Logged On";
				} else if(state.equals("WITH_DRAWAL")) {
					agentState = "Unavailable";
				} else if(state.equals("PRE_AFF")) {
					agentState = "Logged On";
				}
			}
		}
		return agentState;
	}
	
	private static String getAgentWithdrawalType(String agentExtension, TelnetConnect tc) {
		String agentWithdrawalType ="";
		tc.write("agacd " + agentExtension);
		String output = tc.readUntil("(110");
		String[] lines2 = output.split(System.getProperty("line.separator"));
		for(int i = 0; i < lines2.length; i++) {
			if (lines2[i].contains("Withd type")) {
				String withdrawalType = lines2[i].substring(35, 36); 
				if(withdrawalType.equals("1")) {
					agentWithdrawalType = "Meeting";
				} else if(withdrawalType.equals("2")) {
					agentWithdrawalType = "Lunch";
				} else if(withdrawalType.equals("3")) {
					agentWithdrawalType = "Intervention";
				} else if(withdrawalType.equals("4")) {
					agentWithdrawalType = "Labo";
				} else if(withdrawalType.equals("5")) {
					agentWithdrawalType = "Break";
				}
			}
		}
		return agentWithdrawalType;
	}
	
	private static String getAgentDynamicState(String agentExtension, TelnetConnect tc) {
		String agentDynamicState = "";
		tc.write("agacd " + agentExtension);
		String output = tc.readUntil("(110");
		String[] lines2 = output.split(System.getProperty("line.separator"));
		for(int i = 0; i < lines2.length; i++) {
			if (lines2[i].contains("Dynamic State")) {
				String dynamicState = lines2[i].substring(58,71).trim();
				if(dynamicState.equals("OUT OF SERV")) {
					agentDynamicState = "Out of service";
				} else if(dynamicState.equals("FREE")) {
					agentDynamicState = "Free";
				} else if(dynamicState.contains("RING")) {
					agentDynamicState = "Ringing";
				} else if(dynamicState.equals("LOC ACD CONV") || dynamicState.equals("EXT ACD CONV")) {
					agentDynamicState = "In conversation";
				} else if(dynamicState.equals("LOC PRIV CONV") || dynamicState.equals("EXT PRIV CONV")) {
					agentDynamicState = "In conversation";
				} else if(dynamicState.equals("FIN PAUSE")) {
					agentDynamicState = "No PG";
				} else if(dynamicState.equals("IDLE WRAP UP")) {
					agentDynamicState = "Wrap up";
				}
			}
		}
		return agentDynamicState;
	}
		
	private static String getAgentIpAddress(String agentExtension, TelnetConnect tc) {
		String ipAddress = "0.0.0.0";
		tc.write("ippstat d " + agentExtension);
		String output = tc.readUntil("(110");
		String[] lines = output.split(System.getProperty("line.separator"));
		for(int i = 0; i < lines.length; i++) {
			if (lines[i].contains("IPv4")) {
				ipAddress = lines[i].substring(71,87).trim(); 
			}
		}
		return ipAddress;
	}
	
	public static String getAgentFullName(String agentName) {
		String agentFullName = "";
		switch(agentName) {
		case "WILLEMS AGEN Tim":
			agentFullName = "Tim Willems";
			break;
		case "VAN DEN BOSS Roe":
			agentFullName = "Roel Van Den Bossche";
			break;
		case "DEFERME AGEN Ste":
			agentFullName = "Steven Deferme";
			break;
		case "HOLDERBEKE A Ant":
			agentFullName = "Anthony Holderbeke";
			break;
		case "DAMS AGENT Steve":
			agentFullName = "Steve Dams";
			break;
		case "NASSEN AGENT Tho":
			agentFullName = "Thomas Nassen";
			break;
		case "NEUTJENS AGE Ste":
			agentFullName = "Steven Neutjens";
			break;
		case "MEERS AGENT Ronn":
			agentFullName = "Ronny Meers";
			break;
		case "DE SMEDT AGE Tho":
			agentFullName = "Thomas De Smedt";
			break;
		case "STANCU Adrian":
			agentFullName = "Adrian Stancu";
			break;
		case "SCHIETTECAT  Chr":
			agentFullName = "Christophe Schiettecat";
			break;
		default:
			agentFullName = agentName;
			break;
		}
		
		return agentFullName;
	}
	
	public static void main(String[] args) {		
		try {
			ArrayList<Agent> agentList = new ArrayList<Agent>();
			agentList = getAgentList();
			for(Agent agent : agentList) {
				System.out.format(format, agent.getAgentExtension(), agent.getAgentName() , String.valueOf(agent.getLoggedOn()), 
						agent.getAgentStation(), agent.getAgentPG(), agent.getAgentState(), 
						agent.getAgentWithdrawalType(), agent.getAgentDynamicState(), agent.getOffice(), agent.getIpAddress());
				
			}
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		}
	}
}
