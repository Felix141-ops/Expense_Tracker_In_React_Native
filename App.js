// App.js
/// Main app entry point
/// Sets up navigation structure
/// Includes authentication and main tab navigator
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, React } from 'react'
import { supabase } from './lib/supabase'
import DashboardScreen from "./screens/DashboardScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen"; 
import SignupScreen from "./screens/SignupScreen";
import RevenueScreen from "./screens/RevenueScreen";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from './contexts/AuthContext'
import ManageCategoriesScreen from "./screens/ManageCategoriesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
/// Main tab navigator
/// Contains Dashboard, Expenses, Add Expense, and Profile tabs
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") iconName = "home-outline";
          else if (route.name === "Expenses") iconName = "list-outline";
          else if (route.name === "Add") iconName = "add-circle-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Add" component={AddExpenseScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Revenue" component={RevenueScreen} />
    </Tab.Navigator>
  );
}
/// Root stack navigator
/// Handles authentication flow and main app tabs
function AppNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="ManageCategoriesScreen" component={ManageCategoriesScreen} /> 
          <Stack.Screen name="AddExpenseScreen" component={AddExpenseScreen} /> 
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
   useEffect(() => {
    testSupabaseConnection()
  }, [])
  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('expenses').select('*').limit(1)
      if (error) {
        console.log('Supabase connection error:', error)
      } else {
        console.log('Supabase connected successfully!')
      }
      } catch (error) {
        console.log('Connection test failed:', error)
      }
    };
    return (
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    );
  }
