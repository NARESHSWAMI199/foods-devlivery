import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { bodyColor, commentUrl, defaultAvtar, themeColor, userImageUrl } from "../utils/utils"
import { Avatar } from "react-native-elements"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Icon } from "@rneui/themed"
import { Pressable } from "react-native"
import { connect } from "react-redux"
import { ApplicationState } from "../redux"



const CommentRepliesView = (props:any) =>{

    const {
        itemId,
        parent
    } = props

    const [replies,setReplies] = useState<any>([])
    const [parentComment,setParentComment] = useState<any>({})

    const [token , setToken] = useState<string>()
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>()
  
  
    useEffect(()=>{
      const getData =  async() =>{
         setToken(await props.token)
         setIsAuthenticated(!!(await props.token) ? true : false)
      }
      getData()
    },[props.token])

    useEffect (()=>{
        props.updateMainComment(parentComment)
    },[parentComment])

       
    useEffect(()=>{
        axios.defaults.headers['Authorization'] = token;
        axios.get(commentUrl+"detail/"+parent.slug)
        .then(res=>{
            setParentComment(res.data)
        })
        .catch(err => {
            console.log("Comment detail view  : "+err.message)
        })
    },[token])

    
    useEffect(()=>{
        axios.defaults.headers['Authorization'] = token;
        axios.post(commentUrl+"all",{itemId : itemId, parentId : parent.id})
        .then(res=>{
            let response = res.data;
            setReplies(response.content)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[props.refresh,token])




    const handleRepliesLikes = (propsComment:any,isReply:boolean) =>{
        if(!isAuthenticated) {
            return  false
        }
        axios.get(commentUrl+"like/"+propsComment.id)
        .then(res=>{
            let response = res.data
            if(isReply){
                setReplies(previous => previous.filter((comment : any)=> {
                    if(propsComment.id == comment.id){
                        comment.likes +=(!!response.likes) ? response.likes : 0;
                        comment.dislikes +=(!!response.dislikes) ? response.dislikes : 0;
                        comment.isLiked =response.isLiked ;
                        comment.isDisliked = response.isDisliked;
                    }
                    return comment;
                }))
            }else {
                setParentComment(previous => ({
                    ...previous, 
                    dislikes : previous.dislikes +=(!!response.dislikes) ? response.dislikes : 0,
                    likes : previous.likes +=(!!response.likes) ? response.likes : 0,
                    isLiked : response.isLiked,
                    isDisliked : response.isDisliked
                }))
            }



        })
        .catch(err => {
            console.log("Comment Replies view  : "+err.message)
        })
    }


    const handleRepliesDisLikes = (propsComment:any,isReply:boolean) =>{
        /**TODO : show login alert here. */
        if(!isAuthenticated) {
            return  false
        }
        axios.get(commentUrl+"dislike/"+propsComment.id)
        .then(res=>{
            let response = res.data
            if(isReply){
                setReplies(previous => previous.filter((comment : any)=> {
                    if(propsComment.id == comment.id){
                        comment.dislikes +=(!!response.dislikes) ? response.dislikes : 0;
                        comment.likes += (!!response.likes) ? response.likes : 0;
                        comment.isLiked =response.isLiked ;
                        comment.isDisliked = response.isDisliked;
                    }
                    return comment;
                }))
            }else {
                setParentComment(previous => ({
                    ...previous, 
                    dislikes : previous.dislikes +=(!!response.dislikes) ? response.dislikes : 0,
                    likes : previous.likes +=(!!response.likes) ? response.likes : 0,
                    isLiked : response.isLiked,
                    isDisliked : response.isDisliked
                }))
                // /** also update main comment on comment view */
                // props.updateMainComment(parentComment)
            }
        })
        .catch(err => {
            console.log("Comment Replies view  : "+err.message)
        })
    }

    const handleReply = (reply:any,isReply:boolean)=> {
        if(isReply){
            props.handleChildReply(reply)
        }else {
            props.handleParentReply(reply)
        }
    };

    const highlightText = (text:string) => {
        const regex = /@(\w+)/g;
        const parts = text?.split(regex);
      
        return (
          <Text style={style.message}>
            {parts?.map((part, index) => {
                if (index % 2 == 1)  {
                    return  <Text key={index} style={{color: themeColor}}>
                        {"@"+part}
                    </Text>
                }else {
                    return  <Text key={index}>
                    {part}
                </Text>
                }
            })}
          </Text>
        );
    }


    return (<View style={style.body}>

            {/* Parent Comment */}
            <View style={{...style.replyMain,backgroundColor : '#f5fafa'}}>
                <View  style={{...style.replyBody}}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : !!parentComment?.user?.avtar ? userImageUrl+parentComment?.user?.slug+"/"+parentComment?.user?.avtar : defaultAvtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        {/* <View> */}
                            <Text style={{
                                fontSize : 10,
                            }}>
                                {"@ "+parentComment?.user?.username?.toLowerCase()}
                            </Text>
                            {/* <Text style={style.message}> */}
                                {highlightText(parentComment.message)}
                            {/* </Text> */}
                            
                            <View style={style.replyActions}>
                            <View style={style.likesBody}>
                            <Pressable onPress={()=>{
                                    handleRepliesLikes(parentComment,false)
                                }}>
                                   
                                    <Icon 
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-up'
                                        type='font-awesome'
                                        color={!parentComment.isLiked ? '#565757' : themeColor}
                                        size={20}
                                        
                                    /> 
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {!!parentComment.likes && parentComment.likes}
                                </Text>
                                </View>



                                <View style={style.likesBody}>
                                    <Pressable onPress={()=>{
                                        handleRepliesDisLikes(parentComment,false)
                                    }}>
                                        <Icon 
                                            style={{...style.iconStyle,marginRight : 5}}
                                            name='thumbs-down'
                                            type='font-awesome'
                                            color={!parentComment.isDisliked ? '#565757' : themeColor}
                                            size={20}
                                        /> 
                                        </Pressable>
                                    <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                        {!!parentComment.dislikes && parentComment.dislikes}
                                    </Text>
                                </View>
                                <Pressable onPress={()=>handleReply(parentComment,false)}>
                                    <Icon
                                        style={style.iconStyle}
                                        name='reply'
                                        type='font-awesome'
                                        size={20}
                                    />
                                </Pressable>
                            </View>
                        {/* </View> */}
                    </View>
                </View>
            </View>

        {/* All Replies */}
        <ScrollView style={{marginBottom : 120}}>
        {replies.map((reply : any,index : number) => {
            return (
            <View key={index} style={style.replyMain}>
                <View style={{...style.replyBody,marginLeft : 30}}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : !!reply?.user?.avtar ?   userImageUrl+reply.user.slug+"/"+reply.user.avtar : defaultAvtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <Text style={{
                                fontSize : 10,
                            }}>
                                {"@"+reply?.user?.username?.toLowerCase()}
                        </Text>
                        {/* <Text style={style.message}> */}
                            {highlightText(reply.message)}
                        {/* </Text> */}

                        <View style={{...style.replyActions}}>
                        <View style={style.likesBody}>
                            <Pressable onPress={()=>{
                                    handleRepliesLikes(reply,true)
                                }}>
                                   
                                    <Icon 
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-up'
                                        type='font-awesome'
                                        color={!reply.isLiked ? '#565757' : themeColor}
                                        size={20}
                                        
                                    /> 
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {!!reply.likes && reply.likes}
                                </Text>
                            </View>


                            <View style={style.likesBody}>
                                <Pressable onPress={()=>{
                                        handleRepliesDisLikes(reply,true)
                                    }}>
                                   
                                    <Icon 
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-down'
                                        type='font-awesome'
                                        color={!reply.isDisliked ? '#565757' : themeColor}
                                        size={20}
                                        
                                    /> 
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {!!reply.dislikes && reply.dislikes}
                                </Text>
                            </View>
                        <Pressable onPress={()=>handleReply(reply,true)}>
                            <Icon
                                style={style.iconStyle}
                                name='reply'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                        </Pressable>
                        </View>
                    </View>
                </View>
            </View>
            )
        } )}        
        </ScrollView>
        </View>
    )
}


const style = StyleSheet.create({
    body : {
        paddingHorizontal : 10,
        bottomPadding : 100
    },
    replyMain : {
        display : 'flex',
        flexDirection : 'column',
        textAlign : 'left',
        justifyContent : 'center',
        backgroundColor : bodyColor,
        minHeight : 70,
        paddingVertical : 10
    },
    replyBody : {
        display : 'flex',
        flexDirection : 'row',
        textAlign : 'left'
    },
    messageView :{
        alignSelf : 'center',
        paddingLeft : 5
    },
    message : {
        fontSize : 14,
        fontWeight : 'bold',
    },
    totalReplies : {
        fontSize : 10,
        color : 'blue'
    },
    replyActions: {
        display :'flex',
        flexDirection : 'row',
        width : '70%',
        marginTop : 5
    } , iconStyle : {
        display : 'flex',
        justifyContent:'center',
        alignItems : 'center',
        marginRight : 30,
        paddingLeft : 5
    },
    likesBody : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 25,
      }
})

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.token,
        isAuthenticated : !!state.userReducer.token ? true : false
    }
}

export default connect(mapToStateProps)(CommentRepliesView)