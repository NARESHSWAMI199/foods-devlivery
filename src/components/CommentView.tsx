import axios from "axios"
import { useEffect, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Avatar, Button, Input } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import CommentRepliesView from "./CommentReplies"
import { bodyColor, commentUrl, themeColor, userImageUrl } from "../utils/utils"
import { Icon} from "@rneui/themed"




const CommentView = (props:any) =>{

    const [comments,setComments] = useState<any>([])
    const [parent ,setParent] = useState<any>({})
    const [showRepliesModel,setShowRepliesModal] = useState(false)
    
    useEffect(()=>{
        // TODO : Currently itemId is static need to dynamic
        axios.post(commentUrl+"all",{itemId : 1})
        .then(res=>{
            setComments(res.data)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[])


    const showReplies = (parent:any) =>{
        setParent(parent)
        setShowRepliesModal(true)
    }

    const closeModel = () =>{
        setShowRepliesModal(false)
    }


    return (<><View>
        {comments.map((comment : any,index : number) => {
            return (
                <View key={index}  style={{
                    display : 'flex',
                    flexDirection : 'column'
                }}>
                <View style={style.messageBody}>
                    <View>
                        <Avatar size={20}  
                        rounded
                        source={{
                            uri : userImageUrl+comment.user.slug+"/"+comment.user.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <View>
                        <Text style={{
                                fontSize : 10,
                            }}>
                                {"@"+comment?.user?.username?.toLowerCase()}
                        </Text>
                        <Text style={style.message}>
                            {comment.message}
                        </Text>
                        <View style={{...style.replyActions}}>
                            <Icon 
                                style={style.iconStyle}
                                name='thumbs-up'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                            <Icon
                                style={style.iconStyle}
                                name='thumbs-down'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                            <Icon
                                style={style.iconStyle}
                                name='reply'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                        </View>

                        <TouchableOpacity onPress={() =>showReplies(comment)}>
                            <Text style={style.totalReplies} >
                                Reply {comment.repliesCount}
                            </Text>
                        </TouchableOpacity>
                        </View>

                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showRepliesModel}
                    onRequestClose={() => {
                        setShowRepliesModal(false)
                    }}>
                    <View style={{
                            height: '50%',
                            marginTop: 'auto',
                        }}>
         
                        <View style={style.footer}>             
                            <View>
                                <Pressable style={style.goBack} onPress={closeModel}>
                                    <Icon name="arrow-back" type="material" size={24} color="black" style={{fontWeight : 'bold'}} />
                                    <Text style={{...style.subtitle,marginLeft : 10}}>
                                        Replies 
                                    </Text>
                                </Pressable>   
                            </View>
                            <View>
                                <CommentRepliesView parent={parent} itemId={comment.itemId} />
                            </View>
                        </View>
                </View>
                <View style={style.commentInputBody}>
                    <Avatar size={20}  
                    rounded
                    source={{
                        uri :'data:image/png;base64,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'
                    }} />
                    <Input 
                        inputContainerStyle = {{ borderColor : 'white'}}
                        placeholder='Write comment here..'
                        style={style.commentInput}
                        errorStyle= {{display : 'none'}}
                    />
                </View>    
                </Modal>
            </View>
            )
        } )}
    </View>

    </>
    )
}


const style = StyleSheet.create({
    messageBody : {
        display : 'flex',
        flexDirection : 'row',
        textAlign : 'center',
        minHeight : 80,
        paddingVertical : 20,
        shadowColor: "#000",
        paddingHorizontal : 10,
        width : '100%',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 1,
        backgroundColor : bodyColor
    },
    messageView :{
        alignSelf : 'center',
        paddingLeft : 5,
    },
    message : {
        fontSize : 14,
        fontWeight : 'bold',
        paddingRight : 40
    },
    totalReplies : {
        marginVertical : 10,
        fontSize : 12,
        fontWeight : 'bold',
        color : themeColor
    },
    footer: {
        flex : 1,
        backgroundColor: bodyColor
      },
      subtitle : {
        marginVertical : 5,
        fontSize : 16,
        fontWeight : '700'
      },
      goBack : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
        paddingHorizontal : 10,
        paddingVertical : 10
      },
      replyActions: {
        display :'flex',
        flexDirection : 'row',
        flex :1,
        width : '70%',
    } , iconStyle : {
        display : 'flex',
        justifyContent:'center',
        alignItems : 'center',
        marginTop : 6,
        marginRight : 30,
        paddingLeft : 5
    },
    commentInput : {
        fontSize:14,
        borderColor : 'gray',
        height : 50
    },
    commentInputBody : {
        display : 'flex',
        paddingHorizontal : 30,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : bodyColor
      }
})


export default CommentView