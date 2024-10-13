import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { LandingScreen } from './src/screens/LandingPage';
import { MaterialIcons } from 'react-native-vector-icons'


import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { HomeScreen } from './src/screens/HomeScreen';




const switchNavigator = createSwitchNavigator({
  // landingStack: {
  //   screen: createStackNavigator({
  //     // search address screen
  //     Landing: LandingScreen,
  //   },
  //     {
  //       defaultNavigationOptions: {
  //         headerShown: false
  //       }
  //     })
  // },
   homeStack: createBottomTabNavigator({

    // home icon
    home: {
      screen: createStackNavigator({
        HomePage: HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/location.png") :
            require("./src/images/location.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    },
    // home icon
    offer: {
      screen: createStackNavigator({
        HomePage: HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/location.png") :
            require("./src/images/location.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    },
    // home icon
    Address: {
      screen: createStackNavigator({
        HomePage: HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/location.png") :
            require("./src/images/location.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    },
    // home icon
    Cart: {
      screen: createStackNavigator({
        HomePage: HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/location.png") :
            require("./src/images/location.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    }

  })


})


const AppNavigation = createAppContainer(switchNavigator)



export default function App() {

  return (
    <AppNavigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 30,
    height: 30
  }
});