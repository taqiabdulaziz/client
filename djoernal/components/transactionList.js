import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableNativeFeedback,
  ActivityIndicator,
  Modal,
  Button
} from 'react-native'

export default class transactionList extends Component {

  state = {
    modalVisibility: false,
    modalText: "wow"
  }

  render() {
    const { transactionType, debit, kredit, message, items, receipt, date } = this.props.item
    return (
      <View
        style={styles.container}
      >
        <TouchableNativeFeedback onPress={() => this.setState({
          modalVisibility: true
        })}>
          <View style={{
            backgroundColor: "white",
            elevation: 2,
            borderRadius: 4,
            padding: 10,
            flexDirection: "row"
          }}>
            <View style={{
              flex: 1
            }}>
              <Text>{debit.accountType}</Text>
              {
                kredit.map(e => {
                  return (
                    <View>
                      <Text>{ e.product.name } ----- Rp. {e.product.price} * {e.q * -1}</Text>
                      <Text>{e.accountType}</Text>
                    </View>
                  )
                })
              }
            </View>
            <View style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}>
            </View>
          </View>
        </TouchableNativeFeedback>
        {
          this.state.modalVisibility &&
          (
            <Modal
              animationType="fade"
              transparent={true}
              style={{
                height: 200,
              }}
              visible={this.state.modalVisibility}
            >
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.61)" }}>
                <View style={{
                  backgroundColor: "white",
                  width: "80%",
                  height: "40%",
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <ActivityIndicator></ActivityIndicator>
                  <Text>{this.state.modalText}</Text>
                  <Button title="close" onPress={() => this.setState({
                    modalVisibility: false
                  })}></Button>
                </View>
              </View>
            </Modal>
          )
        }
      </View>
    )
  }

  componentDidMount = () => {
    console.log(this.props)
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  image: {
    width: 50,
    height: 120
  }
})
