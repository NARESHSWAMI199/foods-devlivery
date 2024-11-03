import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Item } from '../redux';
import { itemImageUrl,itemsUrl, storeImageUrl, storeUrl } from '../utils/utils';
import { toTitleCase } from '../utils';

const ItemSubCategoryCard = (props : any) =>  {


    const [subcategory,setSubcategory] = useState({
        id : 0,
        subcategory : ''
    });
    const [items, setItems] = useState([]);

    useEffect(()=>{
        if(subcategory != undefined){
            setSubcategory(props.subcategory)
        }
    },[props.subcategory])


    useEffect(()=>{
        axios.post(itemsUrl +"all",{pageSize : 4,subcategoryId : subcategory.id})
        .then(res=>{
            let data = res.data.content;
            setItems(data)
        }).catch(err => {
            console.log(err)
        })
    },[subcategory])

  return (
    <View style={style.main}>
        <View style={style.container}>
            {items.map((item : Item, index)=> {
            const avtar = itemImageUrl+item.slug+"/"+item.avatar
            return  <View key={index} style={style.subcategory}>
                        <Avatar key={index} avatarStyle={{borderRadius : 5}} size={40}
                            source={{uri : avtar}}
                        />
                    </View>
            })}        
        </View>
            <View>
                <Text style={style.subcategoryTitle}>
                    {!!subcategory ? toTitleCase(subcategory.subcategory).split(' ')[0] : ""+subcategory} 
                </Text>
            </View>
    </View>
  )

}





const StoreSubCategoryCard = (props : any) =>  {


    const [subcategory,setSubcategory] = useState({
        id : 0,
        subcategory : ''
    });
    const [items, setItems] = useState([]);

    useEffect(()=>{
        if(subcategory != undefined){
            setSubcategory(props.subcategory)
        }
    },[props.subcategory])


    useEffect(()=>{
        axios.post(storeUrl +"all",{pageSize : 4,subcategoryId : subcategory.id})
        .then(res=>{
            let data = res.data.content;
            setItems(data)
        }).catch(err => {
            console.log(err)
        })
    },[subcategory])

  return (<View style={style.main}>
            <View style={style.container}>
                {items.map((item : Item, index)=> {
                    const avtar = storeImageUrl+item.slug+"/"+item.avatar
                    return (
                         <View key={index} style={style.subcategory}>
                                <Avatar key={index} avatarStyle={{borderRadius : 5}} size={40}
                                    source={{uri : avtar}}
                                />
                        </View>)
                })}        
            </View>
            <View>
                <Text style={style.subcategoryTitle}>
                    {!!subcategory ? toTitleCase(subcategory.subcategory).split(' ')[0] : ""+subcategory} 
                </Text>
            </View>
    </View>
  )

}


const style = StyleSheet.create({
    container : {
        display : 'flex',
        flexWrap : 'wrap',
        height : 100,
        width  : 100,
        alignContent : 'center',
        justifyContent : 'center',
        borderRadius : 20,
        borderBottomColor : '#000',
    },
    subcategory : {
        borderColor : '#f2f5fa',
        borderWidth : 2,
        padding : 3,
        backgroundColor : 'white',
        borderRadius : 10
    },
    main : {
        alignItems :'center',
        width  : '100%',
        padding : 10,
        alignContent : 'center',
        backgroundColor : '#f2f5fa',
        borderRadius : 10,
    },
    subcategoryTitle : {
        marginTop : 5,
        fontSize : 14,
        fontWeight : 'bold',
    }
  })

export { ItemSubCategoryCard, StoreSubCategoryCard};