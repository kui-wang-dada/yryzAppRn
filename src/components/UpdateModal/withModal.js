import React, { Component } from 'react';
import {
  View,
  Modal,
} from 'react-native'
import UpdateModal from './UpdateModal'; // 封装的子Modal

const Modals = {
  'UpdateModal': UpdateModal,
};

export default function withModal(WrappedComponent) {
  return class ModalComponent extends Component {

    constructor(props) {
      super(props);
      this.state = {
        visible: false, // Modal的visible
        renderedModal: null, // Modal所渲染
      };
      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
    }

    // 隐藏Modal
    hideModal() {
      this.setState({
        visible: false,
      });
      this.resolve();
    }

    // 显示Model
    showModal(modalName, params) {
      this.setState({
        visible: true,
        RenderedModal: Modals[modalName],
        params,
      });
      // return一个promise对象
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
      })
    }

    render() {
    const {visible, RenderedModal, params} = this.state;
    return (<View>
        <WrappedComponent {...this.props} showModal={this.showModal}/>
        <Modal
            animationType="fade"
            visible={visible}
            transparent={true}
            onRequestClose={() => {}}>
            {
                RenderedModal
                    ? <RenderedModal {...params} hideModal={this.hideModal}/>
                    : null
            }
        </Modal>
    </View>)
}
}
}
