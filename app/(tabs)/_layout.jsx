import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from '../../constants/themes'


export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: true,
        
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
          tabBarIcon: ({color, size}) => <Ionicons name = 'home' size={size} color={color}/>
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({color, size}) => <Ionicons name = 'bookmark' size={size} color={color}/>
        }}
      
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({color, size}) => <Ionicons name = 'search' size={size} color={color}/>
        }}     
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({color, size}) => <Ionicons name = 'person-circle' size={size} color={color}/>
        }}
      />
    </Tabs>
  );
}
