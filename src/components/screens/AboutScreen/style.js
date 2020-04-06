import {StyleSheet} from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    marginTop: 10,
    textAlign: 'justify'
  },
  info: {
    flex: 1,
    marginTop: 7,
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  link: {
    color: '#255899'
  }
});