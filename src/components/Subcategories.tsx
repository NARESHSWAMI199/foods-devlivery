import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Touchable, TouchableOpacity, View } from 'react-native';
import { itemsUrl, storeUrl } from '../utils/utils';
import {ItemSubCategoryCard,StoreSubCategoryCard} from './SubCategoryCard';
import { Subcategory } from '../redux';

const ItemSubCategories = (props : any)  =>  {

    const [subcategories,setSubcategories] = useState([]);

    useEffect(()=>{
        axios.post(itemsUrl +"subcategory",{pageSize : !!props.size ? props.size  : 6 ,categoryId : props.categoryId , orderBy : 'subcategory',order : 'asc'})
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
        }).catch(err => {
            console.log("subcategory : " ,err)
        })
    },[])

    const handleNavigation = (subcategory : Subcategory) => {
        props.navigation.navigate('subCategrizedItems',subcategory);
      };


  return (<>
  <View style={style.main}>
        {subcategories.map((subcategory : any , index)=>{
        return <TouchableOpacity key={index} style={style.inner} onPress={()=>handleNavigation(subcategory)} > 
                <ItemSubCategoryCard key={index} subcategory = {subcategory} />
            </TouchableOpacity>
        })}
    </View>
    </>
  )

}


const StoreSubCategories = (props : any) =>  {

    const [subcategories,setSubcategories] = useState([]);

    useEffect(()=>{
        axios.post(storeUrl +"subcategory",{pageSize : 6})
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
        }).catch(err => {
            console.log(err)
        })
    },[])

    const handleNavigation = (subcategory : Subcategory) => {
        props.navigation.navigate('subCategrizedItems',subcategory);
    };

  return (<>
  <View style={style.main}>
        {subcategories.map((subcategory : any , index)=>{
           return <TouchableOpacity key={index} style={style.inner} onPress={()=>handleNavigation(subcategory)} > 
                <StoreSubCategoryCard key={index} subcategory = {subcategory} />
            </TouchableOpacity>
        })}
    </View>
    </>
  )

}


const style = StyleSheet.create({
    main : {
        display : 'flex',
        flexDirection : 'row',
        flexWrap : 'wrap',
        width : '100%',
        marginHorizontal : 1
    }, inner : {
        padding : 2,
        width : '33%',
    }
})

export { ItemSubCategories, StoreSubCategories };