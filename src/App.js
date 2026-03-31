import { registerRootComponent } from 'expo';
import { View, Text } from 'react-native';

function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Firebase Project is Running!</Text>
    </View>
  );
}

export default registerRootComponent(App);