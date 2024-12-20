import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, View,Image, Pressable, StatusBar, BackHandler} from 'react-native'
import { bodyColor, getPercentage, itemImageUrl, themeColor, userImageUrl } from '../utils/utils'
import { Item } from '../redux';
import { toTitleCase } from '../utils';
import {Text } from 'react-native-paper';
import { Avatar, Input, Rating, SearchBar } from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';
import { Icon } from '@rneui/themed';
import CustomCarousel from '../components/Carousel';
import CommentView from '../components/CommentView';
import CommentInputBox from '../components/CommentInputBox';




const ItemDetail = (props:any) => {

  const {route, navigation} = props;
  const [state,setState] = useState("")
  const [commentUpdated, setCommentUpdated] = useState(false)
  const commentRef = useRef(null);
  const [parentId,setParentId] = useState<number>(0)

  const item : Item = route.params;


  const updateSearch = (search :any) => {
    setState(search);
  };

  const refreshComment = () => {
    setCommentUpdated(commentUpdated ? false : true)
  }


  const renderViewMore = (onPress:any) => {
    return(
      <View style={{
          display : 'flex', 
          flexDirection : 'row',
          marginVertical : 5
          }}>
        <Icon name='chevron-small-down' color='black' type="entypo" />
       <Text onPress={onPress}>       
        View more
        </Text>
      </View>

    )
  }
  const renderViewLess = (onPress:any) =>{
    return(
      <View 
        style={{
          display : 'flex',
          flexDirection : 'row',
          marginVertical : 5
         }}>
      <Icon name='chevron-small-up'  type="entypo" />
      <Text onPress={onPress}>       
        View less
      </Text>
    </View>
    )
  }


  const handleCommentFoucs = (parentId:number) =>{
    commentRef.current?.blur();
    commentRef.current?.focus();
    setParentId(parentId)
  }

  return (<>
    <StatusBar translucent backgroundColor="transparent"  barStyle="dark-content" />

  <ScrollView style={{ backgroundColor:'white'}} keyboardShouldPersistTaps={'handled'}>

    <View style={styles.imageParent}>
      {/* <Image
         
        style={styles.image} 
        source={{uri : itemImageUrl  +  item.slug + "/"+item.avatar}}
        resizeMode='contain' /> */}

      <CustomCarousel images={
        item.avatars && item.avatars.split(',').map(avtar =>{
          return ( <Image
         style={styles.image} 
         source={{uri : itemImageUrl  +  item.slug + "/"+avtar}}
         resizeMode='contain' />
         )
         })}
         />
    </View>

    <View style={styles.body}>
        <View>
           <Text style={styles.title} variant="titleLarge">{toTitleCase(item.name.trim())} </Text>
        </View>
       
        <View style={styles.priceParent}>
           <Text style={styles.price} variant="titleLarge">{"\u20B9 "+(item.price-item.discount)} </Text>
           <Text style={{...styles.price,
              marginLeft : 20} } 
              variant="titleLarge">
              <Text style={styles.discount}>
                {Math.floor(getPercentage(item.discount,item.price)*1) +"% "}
              </Text>
              {"OFF"}
            </Text>
        </View>

        <View>
          <Text style={styles.totalPrice}>{"\u20B9 " + item.price}</Text>
        </View>

        <View style={styles.rating}>
          <Text style={{...styles.subtitle,
            marginTop : 0,
            marginRight : 10,
            }}>
            {"Rating : "}
          </Text>
          <Rating type='custom' imageSize={25} readonly startingValue={item.rating} />
        </View>


        <View style={{display : 'flex', flexDirection : 'row'}}>
          <Text style={styles.subtitle}>Store : </Text>
            <Text 
              style={{...styles.subtitle,
                fontWeight : '500',
                fontSize : 16
              }}
            > 
              {"Swami sales"}
          </Text>
        </View>
         <View>
            <Text style={styles.subtitle}>Description : </Text>
            <ViewMoreText
              numberOfLines={3}
              renderViewMore={renderViewMore}
              renderViewLess={renderViewLess}
            >
              <Text style={styles.description}>{item.description.trim()}</Text>
            </ViewMoreText>
          </View>
     

        <View style={{
            display : 'flex',
            alignItems : 'center'
            }}>
          <Pressable
            onPress={(e) => console.log("clicked")}
            style={styles.button}
            accessibilityLabel="Learn more about this purple button"
          >
              <Text style={{
                  fontSize : 14, 
                  fontWeight : 'bold',
                  color : 'white'
                  }} >
                  {"ADD TO SLIP"}
              </Text>
          </Pressable>
        </View>
      </View>
        {/* Comments Section */}
        <View>
        <Text style={{...styles.subtitle,paddingHorizontal : 10}}>Comments : </Text>
          <CommentView handleReply={handleCommentFoucs}  isCommentUpdate ={commentUpdated} itemId = { item.id} />
        </View>

  </ScrollView>
      <CommentInputBox
        commentRef={commentRef}
        itemId = {item.id}
        parentId ={parentId}
        isCommentUpdated={refreshComment}
        commentContainer = {styles.commentInputBody}
        style ={styles.commentInput}
      />
  </>
  )
}



const styles = StyleSheet.create({
  imageParent : {
    width : '100%',
    height : 320,
  },
  image : {
    width : '100%',
    height : 305
  },
  body : {
    paddingHorizontal : 15,
    paddingTop : 10,
    opacity : 0.8
  },
  title : {
    fontSize : 16,
    fontWeight : 'bold',
    color : 'black',
    marginRight : 'auto'
  },
  priceParent : {
    display : 'flex',
    flex : 1,
    flexDirection :'row',
    marginTop : 12, 
  },
  price : {
    fontSize : 16,
    fontWeight : 'bold',
    color : 'black',
    opacity : 0.8
  },
  discount : {
    fontSize : 16,
    fontWeight : 'bold',
    color : '#0D6900',
  },
  totalPrice : {
    marginTop : 10, 
    fontSize : 16,
    fontWeight : 'bold',
    color : '#939393',
    textDecorationLine: 'line-through' 
  },
  rating : {
    marginTop : 10,
    marginRight : 'auto',
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center'
  },
  subtitle : {
    marginVertical : 5,
    fontSize : 16,
    fontWeight : '700'
  },
  button : {
    borderRadius : 20,
    height : 45,
    width : '100%',
    backgroundColor : themeColor,
    alignItems  : 'center',
    justifyContent : 'center',
    color : 'white',
    marginVertical : 20
  },
  description : {
    fontSize : 14 , 
    fontWeight : '500',
  },
  commentInput : {
    fontSize:14,
    borderColor : 'gray',
    height : 50
},
commentInputBody : {
  display : 'flex',
  flexDirection : 'row',
  justifyContent : 'center',
  alignItems : 'center',
  paddingHorizontal : 40,
  backgroundColor : bodyColor
}
})

export default ItemDetail