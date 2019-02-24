import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Picker,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  ScrollView,
  Modal,
  StatusBar,
  Platform
} from 'react-native';
import axios from 'axios'
import Gradient from 'react-native-css-gradient'
import { Card, Button } from 'react-native-elements'
const {baseUrl, gradient} = require ('../helpers/helpers')
const {width, height} = Dimensions.get('window')

class Product extends React.Component {
  static navigationOptions = {
    title: 'List Produk / Jasa'
  }

  async componentDidMount() {
    try  {
      let {data} = await axios.get(`${baseUrl}/product`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ list: data });
    } catch (err) {
      console.log(err.message)
    }
  }

  state = {
    list: [],
    name: '',
    stock: 0,
    price: 0,
    hpp: 0,
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  submit = async() => {
    let product = {
      name: this.state.name,
      stock: this.state.stock,
      price: this.state.price,
      hpp: this.state.hpp,
    }
    try {
      let {data} = axios.post(`${baseUrl}/product`, product, { 
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      console.log("sudah di add ke database", data)
    } catch (error){
      console.log(error)
    }
  }

  edit = async(e) => {
    let update = {
      name: this.state.name,
      stock: Number(this.state.stock),
      price: Number(this.state.price),
      hpp: Number(this.state.hpp)
    }
    try {
      let {data} = axios.put(`${baseUrl}/product/${e}`, update, { 
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      console.log("sudah di update", data)
      let products = await axios.get(`${baseUrl}/product`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ list: products.data });
    } catch (error){
      console.log(error)
    }
  }
  
  delete = async(e) => {
    try {
      let {data} = axios.delete(`${baseUrl}/product/${e}`, { 
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      console.log("sudah di delete", data)
      let products = await axios.get(`${baseUrl}/product`, {
        headers: {
          token: await AsyncStorage.getItem("token")
        }
      })
      this.setState({ list: products.data });
    } catch (error){
      console.log(error)
    }
  }

  render() {
    return (
      <Gradient gradient={gradient} style={{width: width, height: height}}>
        <View style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{
              marginTop: height/6,
              marginLeft: width*0.01,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
            }}>
              <Gradient gradient='linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' style={{width: width*0.9, height: height/2, borderRadius: 60}}>
              <TouchableHighlight
                style={styles.smallBtn}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>X</Text>
              </TouchableHighlight>
              <Text></Text>
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <TextInput
                  style={styles.inputModal}
                  onChangeText={(name) => this.setState({name: name})}
                  value={this.state.name}
                />
                <TextInput
                  style={styles.inputModal}
                  onChangeText={(stock) => this.setState({stock: stock})}
                  value={String(this.state.stock)}
                />
                <TextInput
                  style={styles.inputModal}
                  onChangeText={(price) => this.setState({price: price})}
                  value={String(this.state.price)}
                />
                <TextInput
                  style={styles.inputModal}
                  onChangeText={(hpp) => this.setState({hpp: hpp})}
                  value={String(this.state.hpp)}
                />
                <Text></Text>
                <TouchableHighlight
                  style={styles.smallBtn}
                  onPress={() => {
                    this.edit(this.state.id);
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Submit</Text>
                </TouchableHighlight>
              </View>
            </Gradient>
            </View>
          </Modal>
          <ScrollView>
            <View style={styles.box}>
              <Text style={styles.text}>Nama: </Text>
              <TextInput
                style={styles.input}
                placeholder={"nama"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(name) => this.setState({ name })}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Stok: </Text>
              <TextInput
                style={styles.input}
                placeholder={"stock"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(stock) => this.setState({ stock })}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Harga: </Text>
              <TextInput
                style={styles.input}
                placeholder={"harga"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(price) => this.setState({ price })}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.text}>Harga Pokok Penjualan: </Text>
              <TextInput
                style={styles.input}
                placeholder={"hpp"}
                placeholderTextColor={'rgba(255, 255, 255, 0.7)'}
                onChangeText={(hpp) => this.setState({ hpp })}
              />
            </View>
            <View style={styles.box}>
              <TouchableOpacity style={styles.btn} onPress={this.submit}>
                <Text style={styles.text}>Submit</Text>
              </TouchableOpacity> 
            </View>
            <View>
              {this.state.list.map((item, index)=> (
                <Card title={item.name} key={index} >
                  <Text>Stock: {item.stock}</Text>
                  <Text>Price: {item.price}</Text>
                  <Text>Harga pokok penjualan: {item.hpp}</Text>
                  <Button
                    onPress={() => {
                      this.setState({ id: item._id, name: item.name, stock: item.stock, price: item.price, hpp: item.hpp });
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                    title="Edit"
                    color="#841584"
                    accessibilityLabel="Edit"
                  />
                  <Button
                    onPress={() => { this.delete(item._id) }}
                    title="Delete"
                    color="#841584"
                    accessibilityLabel="Delete"
                  />
                </Card>
              ))}
            </View>
          </ScrollView>
        </View>
      </Gradient>
    );
  }
}

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: 'serif',
    fontSize: 14,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  boxWrapper: {
    width: width,
    height: height/4,
    alignItems: 'flex-start',
    margin: 5,
  },
  box: {
    flex: 1,
    width: width * 0.95,
    flexDirection: 'row',
    margin: 5
  },
  input: {
    flex:2.5, 
    height: 30, 
    borderRadius: 60,
    paddingLeft: 20,
    backgroundColor: 'azure'
  },
  inputModal: {
    width: width * 0.8,
    height: 30, 
    borderRadius: 60,
    paddingLeft: 20,
    backgroundColor: 'white'
  },
  pickerItem: {
    marginTop: -10,
    marginLeft: -10
  },
  text: {
    flex: 1, 
    paddingTop: 5, 
    paddingLeft: 20
  },
  btn: {
    width: width - 55,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#3CB371',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 25
  },
  smallBtn: {
    width: width/5,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: width *0.6
  },
});