// import React, {Component, Fragment, PureComponent} from 'react';
// import ExportJsonExcel from 'js-export-excel';
// import {
//   Divider,
//   DatePicker,
//   Popconfirm,
//   message,
//   Layout,
//   Modal,
//   Table,
//   Form,
//   Input,
//   Button,
//   Card,
//   Col,
//   Row,
//   Icon,
//   Upload,
//   Select
// } from 'antd';
// import {connect} from 'dva';
// import styles from '../Table.less';
// import { getCurrentUser, getMyHeaders,getDefaultAction,getDefaultImg } from '../../utils/utils';
// const { MonthPicker } = DatePicker;
//
// const { TextArea } = Input;
// const ButtonGroup = Button.Group;
//
// @connect(({feedbackmodel,loading}) => ({
//   subjectList:feedbackmodel.subjectList,
//   subjectBean:feedbackmodel.subjectBean,
//   loading:loading.models.feedbackmodel
// }))
//
// class feedbackTable extends Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       visible: false,
//       dataSource: [],
//       imageUrl:'',
//       fileList:[],
//       street:""
//     };
//   }
//   componentDidMount() {
//     this.initDataSource();
//   }
//   //导出
//   downloadExcel = () => {
// // currentPro 是列表数据
//     const { dataSource } = this.state;
//
//     var option={};
//     let dataTable = [];
//     if (dataSource.length>0) {
//       for (let i in dataSource) {
//         let obj = {
//           '编号':dataSource[i].id,
//           '标题': dataSource[i].title,
//           '内容': dataSource[i].content,
//           '街道': dataSource[i].scope,
//           '时间': dataSource[i].creattime,
//         };
//         dataTable.push(obj);
//
//       }
//     }
//     option.fileName = '问题反馈';
//     option.datas=[
//       {
//         sheetData:dataTable,
//         sheetName:'sheet',
//         sheetFilter:['编号','标题','内容','街道','时间'],
//         sheetHeader:['编号','标题','内容','街道','时间'],
//       }
//     ];
//     var toExcel = new ExportJsonExcel(option); //new
//     toExcel.saveExcel();
//   };
//   //获取表格数据
//   initDataSource=()=>{
//     //const street=JSON.parse(getCurrentUser()).data.street;
//     const street="北京市";
//     //console.log(street);
//     const {dispatch} =this.props;
//     let filter="select * from tb_feedback ";
//     if(street!=="北京市"){
//       filter+=" where scope like "+"'%"+street+"%'";
//     }
//     filter+=" order by id desc";
//     console.log(filter);
//     dispatch({
//       type:'feedbackmodel/fetch',
//       payload:{
//         table:'tb_feedback',
//         action:'select',
//         filter:filter
//       }
//     }).then(() => {
//       const { subjectList }  = this.props;
//       const dataSource=subjectList.data;
//       this.setState({dataSource:dataSource});
//     });
//   };
//   //新增
//   handleAdd = () => {
//     this.showModal();
//   };
//   //呼出Modal
//   showModal = () => {
//     this.setState({
//       visible: true,
//     });
//   };
//   //关闭modal
//   cancelModal = () => {
//     this.setState({fileList:[]});
//     this.setState({
//       visible: false,
//     });
//   };
//   //修改
//   handEdit=key=>{
//     const {dispatch} =this.props;
//     let filter="select * from tb_feedback where id="+key+"";
//     dispatch({
//       type:'feedbackmodel/queryById',
//       payload:{
//         table:'tb_feedback',
//         action:'select',
//         filter:filter
//       }
//     }).then(() => {
//       const { subjectBean } = this.props;
//       console.log(subjectBean);
//       const { title, cname, scope, content,usetime,id,attach,creattime } = subjectBean.data[0];
//       let fileList;
//       fileList=JSON.parse(attach);
//
//       console.log(fileList);
//       this.setState({fileList});
//       this.props.form.setFieldsValue({
//         title,
//         cname,
//         creattime,
//         scope,
//         content,
//         usetime,
//         id
//       });
//       this.showModal();
//     });
//   };
//
//   //刷新
//   handleReset=()=>{
//     const { form } = this.props;
//     form.resetFields();
//     this.initDataSource();
//   };
//   //条件查询
//   setVal = (val) => { //子组件传值
//     const {dispatch} =this.props;
//     this.setState({searchVal:val});
//     const street=JSON.parse(getCurrentUser()).data.street;
//     let filter="select * from tb_feedback where 1=1 ";
//     if(street!=="北京市"){
//       filter+=" and scope like "+"'%"+street+"%'";
//     }
//     if(val.starttime!==undefined){
//       filter+= " and to_char(creattime, 'yyyy-MM')>=" + "'" + val.starttime + "'";
//     }
//     if(val.endtime!==undefined){
//       filter+= " and to_char(creattime, 'yyyy-MM')<=" + "'" + val.endtime + "'";
//     }
//     if(val.key!==undefined){
//       filter+="and title like "+"'%"+val.key+"%'  ";
//     }
//     filter+=" order by id desc";
//     dispatch({
//       type:'feedbackmodel/fetch',
//       payload:{
//         table:'tb_feedback',
//         action:'select',
//         filter:filter
//       }
//     }).then(() => {
//       const { subjectList } = this.props;
//       const dataSource=subjectList.data;
//       this.setState({dataSource:dataSource});
//     });
//   };
// //上传
//
//   render(){
//     const { authorization } = getMyHeaders();
//     const headers={authorization:authorization};
//     const { imageUrl } = this.state;
//     const {visible,dataSource,loading,fileList} = this.state;
//     const { getFieldDecorator } = this.props.form;
//     console.log(fileList[1]==null);
//
//     const columns = [
//       {
//         title: '问题编号',
//         dataIndex: 'id',
//
//       },
//       {
//         title: '问题标题',
//         dataIndex: 'title',
//
//       },
//
//       {
//         title: '所属街区',
//         dataIndex: 'scope',
//       },
//       {
//         title:'问题内容',
//         dataIndex: 'content',
//         render:(text)=>{
//           if(text.length>20){
//             return <span> {text.substring(0,20)+"....."}</span>
//           }
//           else
//             return <span>{text}</span>
//         }
//       },
//       {
//         title: '操作',
//         dataIndex: 'operation',
//         render: (text, record) =>
//           (dataSource.length >= 1 ? (
//             <Fragment>
//               <a onClick={() => this.handEdit(record.id)}>查看</a>
//
//             </Fragment>
//           ) : null),
//       },
//     ];
//
//     const img=()=>{
//       let attr=[];
//       if(fileList.length>0){
//         for (let i=0;i<fileList.length;i++){
//           attr.push(
//             <Col span={5}><img src={fileList[i]} width="150px" height="150px"/></Col>
//           )
//         }
//       }
//       const  tableDom = attr.map((ele) => {
//         return ele
//       });
//       return tableDom;
//     };
//     //But,the world become bigger,how do you return?
//     //How do you come back when the world gets bigger？
//     const form = () => {
//
//       return (
//         <Form layout="inline" >
//           <Form.Item label="请输入标题" style={{ width: 300 }}>
//             {getFieldDecorator('title', {
//               rules: [{
//                 required: true,
//                 message: '请输入标题',
//               }],
//             })(< h1/>)}
//           </Form.Item>
//
//         </Form>
//         // {/*<Form >*/}
//         // {/*  <Row>*/}
//         // {/*    <Col span={24}>*/}
//         // {/*      <Form.Item label="问题编号:">*/}
//         // {/*        {getFieldDecorator('id', {*/}
//         //
//         // {/*        })(*/}
//         // {/*          <Input  readOnly="readOnly" />,*/}
//         // {/*        )}*/}
//         // {/*      </Form.Item>*/}
//         // {/*    </Col>*/}
//         // {/*  </Row>*/}
//         // {/*  <Row>*/}
//         // {/*    <Col span={3}>*/}
//         // {/*      <h2>问题标题：</h2>*/}
//         // {/*    </Col>*/}
//         // {/*    <Col span={20}>*/}
//         // {/*      <Form.Item>*/}
//         // {/*        {getFieldDecorator('title', {*/}
//         // {/*        })(*/}
//         // {/*          <Input  readOnly="readOnly" />,*/}
//         // {/*        )}*/}
//         // {/*      </Form.Item>*/}
//         // {/*    </Col>*/}
//         //
//         // {/*  </Row>*/}
//         //
//         // {/*  <Row>*/}
//         // {/*    <Col span={3}>*/}
//         // {/*      <h2>创建时间：</h2>*/}
//         // {/*    </Col>*/}
//         // {/*    <Col span={20}>*/}
//         // {/*      <Form.Item>*/}
//         // {/*        {getFieldDecorator('creattime', {*/}
//         //
//         // {/*        })(*/}
//         // {/*          <Input readOnly="readOnly" />,*/}
//         // {/*        )}*/}
//         // {/*      </Form.Item>*/}
//         // {/*    </Col>*/}
//         // {/*  </Row>*/}
//         // {/*  <Row>*/}
//         // {/*    <Col span={3}>*/}
//         // {/*      <h2>所属街道：</h2>*/}
//         // {/*    </Col>*/}
//         // {/*    <Col span={20}>*/}
//         // {/*      <Form.Item>*/}
//         // {/*        {getFieldDecorator('scope', {*/}
//         // {/*        })(*/}
//         // {/*          <Input readOnly="readOnly" />,*/}
//         // {/*        )}*/}
//         // {/*      </Form.Item>*/}
//         // {/*    </Col>*/}
//         // {/*  </Row>*/}
//         //
//         // {/*  <Row>*/}
//         // {/*    <Col span={3}>*/}
//         // {/*      <h2>问题内容：</h2>*/}
//         // {/*    </Col>*/}
//         // {/*    <Col span={20}>*/}
//         // {/*      <Form.Item>*/}
//         // {/*        {getFieldDecorator('content', {*/}
//         //
//         // {/*        })(*/}
//         // {/*          <TextArea placeholder="请输入月报内容" readOnly="readOnly"*/}
//         // {/*          />,*/}
//         // {/*        )}*/}
//         // {/*      </Form.Item>*/}
//         // {/*    </Col>*/}
//         // {/*  </Row>*/}
//         // {/*  <Row>*/}
//         // {/*    <Col span={3}>*/}
//         // {/*      <h2>附件：</h2>*/}
//         // {/*    </Col>*/}
//         // {/*    <Col span={20}>*/}
//         // {/*      <Form.Item>*/}
//         // {/*        {img()}*/}
//         // {/*      </Form.Item>*/}
//         // {/*    </Col>*/}
//         // {/*  </Row>*/}
//         //
//         // {/*</Form>*/}
//       );
//
//     };
//     return(
//       <Layout>
//         <Card bordered={false}>
//           <div className={styles.tableList}>
//             <div className={styles.tableListForm}>
//               <Search  dispatch={this.props.dispatch}  setVal={this.setVal}/>
//             </div>
//             <div className={styles.tableListOperator}>
//               <Modal
//                 width="80%"
//                 title="问题反馈"
//                 visible={visible}
//                 destroyOnClose
//                 onCancel={this.cancelModal}
//                 mask={false}
//                 footer={null}
//                 style={{ paddingTop: 0 }}
//               >
//                 {form()}
//               </Modal>
//             </div>
//             <div className={styles.tableSets}>
//               问题反馈
//               <ButtonGroup style={{float:"right"}}>
//
//                 <Button onClick={this.handleReset}><Icon type="reload"/>刷新</Button>
//                 <Button onClick={this.downloadExcel}><Icon type="download"/>下载</Button>
//               </ButtonGroup>
//             </div>
//
//             <Table
//               dataSource={dataSource}
//               columns={columns}
//               loading={loading}
//               pagination={{defaultPageSize:5}}
//             />
//           </div>
//         </Card>
//       </Layout>
//     )
//   }
// }
// class Search extends PureComponent {
//   state = {};
//   handleReset=()=>{
//     const { form } = this.props;
//     form.resetFields();
//     const {setVal} = this.props;//重要
//     let values={
//       starttime:undefined,
//       endtime:undefined,
//       key:undefined
//     };
//     setVal(values);
//
//   };
//   onValidateForm = (e) => {
//     e.preventDefault();
//     const {validateFields} = this.props.form;
//     const {setVal} = this.props;//重要
//     validateFields((err, values) => {
//       if (!err) {
//         if (values.starttime) {
//           values.starttime = values.starttime.format('YYYY-MM');
//         }
//         if (values.endtime) {
//           values.endtime = values.endtime.format('YYYY-MM');
//         }
//         setVal(values);
//       }
//     });
//   };
//
//   render() {
//     const {} = this.props;
//     const {getFieldDecorator} = this.props.form;
//     return (
//       <Form onSubmit={this.onValidateForm}>
//         <Row>
//           <Col span={5}>
//             <Form.Item>
//               {getFieldDecorator('starttime', {
//
//               })(
//                 <MonthPicker format="YYYY-MM" placeholder="请选择起止日期"/>,
//               )}
//             </Form.Item>
//
//           </Col>
//           <Col span={5}>
//             <Form.Item>
//               {getFieldDecorator('endtime', {})(
//                 <MonthPicker format="YYYY-MM" placeholder="请选择结束日期"/>,
//               )}
//             </Form.Item>
//           </Col>
//           <Col span={5}>
//             <Form.Item>
//               {getFieldDecorator('key', {
//
//               })(<Input placeholder="输入关键字"/>
//               )}
//             </Form.Item>
//           </Col>
//           <Col span={1}>
//
//           </Col>
//           <Col span={2}>
//             <Button type="primary" htmlType="submit" >
//               <Icon type="search"/>
//               查询
//             </Button>
//
//           </Col>
//
//           <Col span={2}>
//             <Button onClick={this.handleReset} type="primary" style={{marginLeft: 20}}>
//               <Icon type="redo" />重置
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     );
//   }
// }
// Search = Form.create()(Search);
// const feedbackForm = Form.create()(feedbackTable);
// export default feedbackForm;
//
//
//
