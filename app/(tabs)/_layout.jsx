import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/themes'


export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: false,
        tabBarShowLabel: false ,
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: COLORS.backgroundColor,
          position: "absolute",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10
        }
      
      }}>

      <Tabs.Screen
        name="homePage"
        options={{ 
          title: 'Home Page',
          tabBarIcon: ({color, size}) => <Ionicons name = 'home' size={size} color={color}/>
        }}
      />
      
      
      <Tabs.Screen
        name="checker"
        options={{
          title: 'Checker',
          tabBarIcon: ({color, size}) => <Ionicons name = 'checkmark-sharp' size={size} color={color}/>
        }}     
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => <Ionicons name = 'person-circle' size={size} color={color}/>
        }}
      />
    </Tabs>
  );
}
