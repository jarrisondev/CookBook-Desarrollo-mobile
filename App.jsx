import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import "./global.css"
import RecipeListScreen from "./src/screeens/RecipeListScreen";
import RecipeDetailScreen from "./src/screeens/RecipeDetailScreen";
import AddRecipeScreen from "./src/screeens/AddRecipeScreen";
import CookingTipsScreen from "./src/screeens/CookingTipsScreen";



const Tab = createBottomTabNavigator();
const RecipeStack = createNativeStackNavigator();

function RecipesStackNavigator() {
  return (
    <RecipeStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: "#020617",
        },
        headerStyle: {
          backgroundColor: "#0b1220",
        },
        headerTintColor: "#e2e8f0",
        headerTitleStyle: {
          color: "#e2e8f0",
          fontWeight: "700",
        },
      }}
    >
      <RecipeStack.Screen
        name="RecipeListScreen"
        component={RecipeListScreen}
        options={{ title: "Recetas" }}
      />
      <RecipeStack.Screen
        name="RecipeDetailScreen"
        component={RecipeDetailScreen}
        options={{ title: "Detalle de receta" }}
      />
    </RecipeStack.Navigator>
  )
}


export default function  App()  {
  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#020617",
      card: "#0b1220",
      text: "#e2e8f0",
      border: "#1e293b",
      primary: "#06b6d4",
    },
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#06b6d4",
          tabBarInactiveTintColor: "#64748b",
          sceneStyle: {
            backgroundColor: "#020617",
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "700",
          },
          tabBarStyle: {
            backgroundColor: "#0b1220",
            borderTopColor: "#1e293b",
            height: 64,
            paddingTop: 6,
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: "#0b1220",
          },
          headerTintColor: "#e2e8f0",
          headerTitleStyle: {
            color: "#e2e8f0",
            fontWeight: "700",
          },
        }}
      >
        <Tab.Screen
          name="Recetas"
          component={RecipesStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>{"📚"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Nueva Receta"
          component={AddRecipeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>{"📝"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Tips"
          component={CookingTipsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size, color }}>{"💡"}</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}