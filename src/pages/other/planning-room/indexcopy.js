// import React, { Component } from 'react';
// import { Card, Col, Form, List, Row, Input, Icon, Button, Layout, Select, Modal, Upload, message } from 'antd';
// import { connect } from 'dva';
// import { DefaultPlayer as Video } from 'react-html5video';
// import 'react-html5video/dist/styles.css';
// import styles from './style.less';
// import { RestUrl, videoUrl } from '../../../const/localConfig';
// import { getMyHeaders } from '../../../utils/utils';
//
// const { Search } = Input;
// const { Option } = Select;
// const fileUpAction = `${RestUrl}/api/fileUpload`;
//
// @connect(({ room, subject, loading }) => ({
//   listObj: room.listObj,
//   resultList: room.resultList,
//   resultVo: room.resultVo,
//   bTable: subject.baseTable,
//   countList:room.countList,
//   loading: loading.models.room,
// }))
// class PlanRoom extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//       list: [],
//       videoTotal: 0,
//       countList:[],
//       pdfList:[]
//     };
//     this.key = 0;
//     this.href = '';
//     this.baseTable = '';
//     this.cname = ''; // 类别
//     this.initJB();
//   }
//
//   componentDidMount() {
//
//     this.initDataSource({});
//   }
//
//   setHref(href) {
//     this.href = href;
//   }
//
//   handleSubmit = event => {
//     event.preventDefault();
//     const { dispatch, form } = this.props;
//     form.validateFields((error, values) => {
//       if (!error) {
//         const { title, cname } = values;
//         const {pdfList}=this.state;
//         const submitData = {
//           id: this.key,
//           title,
//           cname,
//           href: this.href,
//           attach:JSON.stringify(pdfList),
//           cover:this.href.substring(0,this.href.length-4)+".jpg"
//         }
//
//         this.saveForm(submitData);
//         this.setState({pdfList:[]});
//         this.handleCancel();
//         Modal.destroyAll();
//       }
//     })
//   }
//
//   handleAdd = () => {
//     this.key = 0;
//     this.href = '';
//     this.showModal();
//   }
//
//   handleCancel = e => {
//     this.setState({
//       visible: false,
//     });
//   }
//
//   saveForm = (submitData) => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'room/save',
//       payload: submitData,
//     }).then(() => {
//       this.initDataSource({});
//     })
//   }
//
//   searchTitle = value => {
//     const v = [{
//       name: 'title',
//       where: 'like',
//       value,
//     }, {
//       name: 'cname',
//       where: 'eq',
//       value: this.cname,
//     }];
//     const filter = JSON.stringify(v);
//     const payload = {
//       filter,
//     }
//     this.initDataSource(payload);
//   }
//
//   initJB = () => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'subject/getJb',
//       payload: {
//         flag: 2,
//       },
//     }).then(() => {
//       const { bTable } = this.props;
//       this.baseTable = bTable.data.map(item =>
//         <Select.Option key={item.name}>{item.name}</Select.Option>);
//     })
//   }
//
//   initDataSource = payload => {
//
//     const { dispatch } = this.props;
//     let filter="SELECT tb_study_log.classroomid ,tb_classroom.title ,count(*) FROM tb_classroom,tb_study_log WHERE tb_classroom.id=tb_study_log.classroomid GROUP BY tb_study_log.classroomid , tb_classroom.title";
//     dispatch({
//       type: 'room/searchCount',
//       payload:{
//         table:'tb_classroom',
//         action:'select',
//         filter:filter
//       }
//     }).then(() => {
//       const { countList} = this.props;
//
//       this.setState({ countList: countList.data });
//     });
//
//     dispatch({
//       type: 'room/fetchList',
//       payload,
//     }).then(() => {
//       const { resultList: { data } } = this.props;
//       const list = data.map(obj => {
//         const { id, title, href, cover, createdat,attach } = obj;
//
//         let fileHref=[];
//         if(JSON.parse(attach)!==null){
//           for(let i =0;i<JSON.parse(attach).length;i++){
//             fileHref.push("http://www.bjcsghxh.com/data/video/"+JSON.parse(attach)[i]);
//           }
//         }
//
//
//         let item = {
//           id,
//           title,
//           videoHref: `${videoUrl}/${href}`,
//           fileHref: fileHref,
//           cover: `${videoUrl}/${cover}`,
//           createdat,
//         };
//         item.count=0;
//         return item;
//       });
//
//       const videoTotal = list.length;
//       this.setState({ list, videoTotal });
//
//     })
//   };
//
//   showModal = () => {
//     this.setState({
//       visible: true,
//     });
//   }
//
//   videoDel = key => {
//     const payload = {
//       key,
//     }
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'room/del',
//       payload,
//     }).then(() => {
//       const { resultVo } = this.props;
//       if (resultVo.msg === 'success') {
//         this.initDataSource({});
//       }
//     })
//   }
//
//   videoEdit = key => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'room/fetch',
//       payload: { key },
//     }).then(() => {
//       const { resultVo } = this.props;
//       const { title, href, cname } = resultVo.data;
//       this.props.form.setFieldsValue({
//         title,
//         cname,
//       });
//       this.href = href;
//       this.key = key;
//       this.showModal();
//     });
//   }
//
//   handleChange = value => {
//     this.cname = value;
//   }
//
//   countChange=key=>{
//     console.log(key);
//     window.location.href=key;
//   };
//   render() {
//
//     const { loading } = this.props;
//     const { list, videoTotal ,countList,pdfList} = this.state;
//     const { getFieldDecorator } = this.props.form;
//
//     const realList=()=>{
//       if(countList.length>0 && list.length>0){
//
//         for(let i=0;i<countList.length;i++){
//           for(let j=0;j<list.length;j++){
//             if(list[j].id===countList[i].classroomid){
//               list[j].count=countList[i].count;
//             }
//           }
//
//         }
//       }
//       return list;
//     };
//
//     const paginationProps = {
//       showSizeChanger: false,
//       showQuickJumper: false,
//       pageSize: 4,
//       total: videoTotal,
//       itemRender: (current, type, originalElement) => {
//         if (type === 'prev') {
//           return <a>上一页</a>;
//         }
//         if (type === 'next') {
//           return <a>下一页</a>;
//         }
//         return originalElement;
//       },
//     };
//
//     const delVideo = obj => {
//       this.videoDel(obj.id);
//     }
//
//     const editVideo = obj => {
//       this.videoEdit(obj.id);
//     };
//
//     const img=(item)=>{
//       console.log(item.fileHref);
//       if(item.fileHref.length===0){
//         return(
//           <img style={{ width: '40%', height: 80, marginBottom: 10 }}
//                src="http://www.bjcsghxh.com/data/altern/暂无附件.png"
//
//           />
//         );
//       }
//       else {
//         let attr=[];
//         for(let i=0;i<item.fileHref.length;i++){
//           attr.push(
//             <img src="http://www.bjcsghxh.com/data/video/file.jpg" style={{ width: '40%', height: 80, marginBottom: 10 ,marginRight:10}}
//                  onClick={() => this.countChange(item.fileHref[i])}/>
//           )
//         }
//         const  tableDom = attr.map((ele) => {
//           return ele
//         });
//         return tableDom;
//       }
//
//     };
//
//     const cardList = list ? (
//       <List
//         rowKey="key"
//         loading={loading}
//         grid={{
//           gutter: 10,
//           xs: 1,
//           sm: 1,
//           md: 4,
//           lg: 4,
//           xl: 4,
//           xxl: 4,
//         }}
//         pagination={paginationProps}
//         dataSource={realList()}
//         renderItem={item => (
//           <List.Item key={item.id}>
//             <Card
//               style={{ height: 320, width: '100%' }}
//               className={styles.card}
//               actions={[<div onClick={editVideo.bind(this, item)}><Icon type="edit" /></div>, <div onClick={delVideo.bind(this, item)}><Icon type="delete" /></div>]}
//             >
//
//               <Video
//                 style={{ width: '100%', height: 100, marginBottom: 10 }}
//                 src={item.videoHref}
//
//                 poster={item.cover}
//               >
//               </Video>
//               {img(item)}
//
//               <Card.Meta
//                 title={<span
//                   className={styles.cardMetaTitle}>&nbsp;&nbsp;&nbsp;{item.title}&nbsp;&nbsp;
//                 </span>}
//               />
//               <Card.Meta
//                 title={<span
//                   className={styles.cardMetaTitle}>&nbsp;&nbsp;&nbsp;浏览次数：{item.count}&nbsp;&nbsp;
//                 </span>}
//               />
//
//             </Card>
//           </List.Item>
//         )}
//       />
//     ) : null;
//
//     const setHref = href => {
//       this.setHref(href);
//     };
//     const setAttach = href => {
//       const {pdfList}=this.state;
//       pdfList.push(href);
//       this.setState({pdfList:pdfList});
//     };
//     const headers = getMyHeaders();
//     // const headers={authorization:"Bearer " +
//     //      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiwxLnBuZyIsImlhdCI6MTU3MjUwMzIyOSwiZXhwIjoxNTcyNTg5MjI5fQ.2lhZqz-OB2mjna1oTzU-hezdX4n_fikhmZNul0vVqBw"};
//
//     const uploadProps = {
//       name: 'file',
//       action: fileUpAction,
//       accept: '.mp4,.mov,.pdf,.docx',
//       data: {
//         attr: 'video',
//       },
//       headers,
//       onChange(info) {
//         if (info.file.status !== 'uploading') {
//           // console.log(info.file, info.fileList);
//         }
//         if (info.file.status === 'done') {
//           message.success(`${info.file.name} 文件上传成功`);
//           const href = info.file.response.data;
//           if(href.indexOf(".mp4")!==-1){
//             setHref(href);
//           }else {
//             setAttach(href);
//           }
//
//         } else if (info.file.status === 'error') {
//           message.error(`${info.file.name} 文件上传失败.`);
//         }
//       },
//     }
//
//     return (
//       <Layout style={{ margin: '0', position: 'relative', minHeight: 0 }}>
//         <Card
//           bordered={false}
//           style={{ marginTop: 20 }}
//           bodyStyle={{ padding: '0 32px 20px 32px' }}
//         >
//           <div style={{ marginTop: 20 }}>
//             <Select
//               onChange={this.handleChange}
//               style={{ width: '20%', marginRight: 10 }}
//               placeholder="选择类别"
//             >
//               {this.baseTable}
//             </Select>
//             <Search style={{ width: '40%' }} placeholder="标题查询" onSearch={this.searchTitle} enterButton />
//             <Button onClick={this.handleAdd} type="primary" style={{ marginLeft: 10 }}>
//               添加
//             </Button>
//           </div>
//           <div className={styles.cardList} style={{ marginTop: 20 }}>{cardList}</div>
//         </Card>
//         <Modal
//           style={{ marginTop: 100 }}
//           title="视频资料"
//           visible={this.state.visible}
//           destroyOnClose
//           onCancel={this.handleCancel}
//           mask={false}
//           footer={null}
//         >
//           <Form layout="inline" onSubmit={this.handleSubmit}>
//             <Form.Item label="请输入标题" style={{ width: 300 }}>
//               {getFieldDecorator('title', {
//                 rules: [{
//                   required: true,
//                   message: '请输入标题',
//                 }],
//               })(<Input />)}
//             </Form.Item>
//             <Form.Item label="请选择分类" style={{ marginTop: 20, width: 300 }}>
//               {getFieldDecorator('cname', {
//                 rules: [{
//                   required: true,
//                   message: '请选择分类',
//                 }],
//               })(<Select
//                 showSearch
//                 style={{ width: 190 }}
//                 placeholder="选择分类"
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                 }
//               >
//                 {this.baseTable}
//               </Select>)}
//             </Form.Item>
//             <Form.Item label="视频文件" style={{ marginTop: 20, width: 300 }}>
//               {getFieldDecorator('href', {
//                 rules: [{
//                   required: false,
//                   message: '请上传视频文件',
//                 }],
//               })(
//                 <Upload {...uploadProps}>
//                   <Button>
//                     <Icon type="upload" /> 点击上传文件
//                   </Button>
//                 </Upload>,
//               )}
//             </Form.Item>
//             <Form.Item style={{ marginTop: 20, width: 300 }}>
//               <Button size="large" type="primary" htmlType="submit">提交</Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//       </Layout>
//     );
//   }
// }
//
// const PlanRoomForm = Form.create()(PlanRoom);
// export default PlanRoomForm;
