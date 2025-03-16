import { Icon } from '@rneui/themed';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import ViewMoreText from 'react-native-view-more-text';
import { connect } from 'react-redux';
import CustomCarousel from '../components/Carousel';
import RatingModal from '../components/RatingModal';
import UserReview from '../components/UserReview';
import { ApplicationState, Item } from '../redux';
import { toTitleCase } from '../utils';
import { logError, logInfo } from '../utils/logger'; // Import logger
import { bodyColor, getPercentage, itemImageUrl, itemsUrl, reviewUrl, storeUrl, themeColor } from '../utils/utils';
import { Rating } from 'react-native-elements';

const ItemDetail = (props: any) => {
  const { route, navigation, isAuthenticated, user } = props;
  const [state, setState] = useState("");
  const [commentUpdated, setCommentUpdated] = useState(false);
  const commentRef = useRef(null);
  const [parentId, setParentId] = useState<number>(0);
  const [storeName, setStoreName] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [totalRatings, setTotalRatings] = useState(0);
  const [item, setItem] = useState<Item>(route.params);
  const [itemReviews, setItemReviews] = useState<any>([]);
  const [totalReviesElement, setTotalReviewsElement] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [userReview, setUserReview] = useState<any>(null);

  // Get item ratings
  useEffect(() => {
    axios.get(`${itemsUrl}ratings/${item.slug}`)
      .then(res => {
        setTotalRatings(res.data.totalRating);
      }).catch(err => {
        logError(`Error fetching rating count details: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
      });
  }, []);

  // Function to get ratings
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    setIsFetchingMore(true);
    axios.post(reviewUrl + 'all', { itemId: item.id, pageNumber })
      .then(res => {
        let response = res.data;
        const reviews = response.content;
        setItemReviews(prevReviews => [...prevReviews, ...reviews]);
        setTotalReviewsElement(response.totalElements);
        setIsFetchingMore(false);

        // Check if the authenticated user has already reviewed the item
        if (isAuthenticated) {
          const userReview = reviews.find((review: any) => review.userId === user.id);
          setUserReview(userReview);
        }
      })
      .catch(err => {
        logError(`Error fetching item reviews: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
        setIsFetchingMore(false);
      });
  };

  const handleLike = async (reviewId: number) => {
    if (!isAuthenticated) {
      navigation.navigate('login' as never);
      return;
    }
    await axios.get(reviewUrl + "like/" + reviewId)
      .then(res => {
        let response = res.data;
        setItemReviews(previous => previous.filter((review: any) => {
          if (review.id == reviewId) {
            review.likes += (!!response.likes) ? response.likes : 0;
            review.dislikes += (!!response.dislikes) ? response.dislikes : 0;
            review.isLiked = response.isLiked;
            review.isDisliked = response.isDisliked;
          }
          return review;
        }));
        logInfo(`Liked review with ID: ${reviewId}`);
      })
      .catch(err => {
        logError(`Error updating likes: ${err.message}`);
      });
  };

  const handleDisLike = async (reviewId: number) => {
    if (!isAuthenticated) {
      navigation.navigate('login' as never);
      return;
    }
    await axios.get(reviewUrl + "dislike/" + reviewId)
      .then(res => {
        let response = res.data;
        setItemReviews(previous => previous.filter((review: any) => {
          if (review.id == reviewId) {
            review.likes += (!!response.likes) ? response.likes : 0;
            review.dislikes += (!!response.dislikes) ? response.dislikes : 0;
            review.isLiked = response.isLiked;
            review.isDisliked = response.isDisliked;
          }
          return review;
        }));
        logInfo(`Disliked review with ID: ${reviewId}`);
      })
      .catch(err => {
        logError(`Error updating dislikes: ${err.message}`);
      });
  };

  const handleScroll = ({ nativeEvent }) => {
    if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20) {
      setPageNumber(prevPageNumber => prevPageNumber + 1);
      fetchReviews();
    }
  };

  // Function to update search query
  const updateSearch = (search: any) => {
    setState(search);
    logInfo(`Search query updated: ${search}`);
  };

  // Function to add new comments
  const addNewComment = (comment: string) => {
    setNewComment(comment);
    logInfo(`Comments refreshed`);
  };

  // Function to render "View More" text
  const renderViewMore = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-down' color='black' type="entypo" />
        <Text onPress={onPress}>View more</Text>
      </View>
    );
  };

  // Function to render "View Less" text
  const renderViewLess = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-up' type="entypo" />
        <Text onPress={onPress}>View less</Text>
      </View>
    );
  };

  // Function to handle comment focus
  const handleCommentFoucs = (parentId: number) => {
    commentRef.current?.blur();
    commentRef.current?.focus();
    setParentId(parentId);
    logInfo(`Comment focused with parentId: ${parentId}`);
  };

  // Fetch store details
  useEffect(() => {
    if (item) {
      axios.get(`${storeUrl}-detail/${item.wholesaleId}`)
        .then(res => {
          setStoreName(res.data.storeName);
          logInfo(`Store details fetched successfully for storeId: ${item.wholesaleId}`);
        })
        .catch(err => {
          logError(`Error fetching store details: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
        });
    }
  }, [item]);

  // Function to handle add to slip
  const handleAddToSlip = () => {
    if (!isAuthenticated) {
      navigation.navigate('login');
      return;
    }
    navigation.navigate('AddToSlip', { item });
  };

  const handleRatingSubmit = (rating: Number) => {
    axios.post(itemsUrl + `update/ratings`, {
      itemId: item.id,
      rating: rating
    })
      .then(res => {
        Alert.alert("Thank you", "Your feedback has been saved successfully.");
        let response = res.data;
        setItem(previous => ({ ...previous, rating: response.ratingAvg }));
        logInfo(response.message);
      }).catch(err => {
        logError(`Error during update item ratings: ${!!err.response ? err.response.data?.message : err.message}`);
      });
  };

  const handleReviewSubmit = (review: string, rating: number) => {
    axios.post(reviewUrl + 'add', {
      itemId: item.id,
      rating,
      message: review
    })
      .then(res => {
        Alert.alert("Thank you", "Your review has been submitted successfully.");
        logInfo(res.data.message);
        setUserReview({ ...userReview, message: review, rating });
        fetchReviews(); // Refresh reviews
      })
      .catch(err => {
        logError(`Error submitting review: ${!!err.response ? err.response.data?.message : err.message}`);
      });
  };

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name='arrow-back' color='white' />
      </TouchableOpacity>
      <ScrollView style={styles.mainScroll} keyboardShouldPersistTaps={'handled'} onScroll={handleScroll} scrollEventThrottle={400}>
          <View style={styles.imageParent}>
            <CustomCarousel images={
              item.avatars && item.avatars.split(',').map(avtar => {
                return (
                  <Image
                    style={styles.image}
                    source={{ uri: itemImageUrl + item.slug + "/" + avtar }}
                    resizeMode='cover'
                    alt='Item Images'
                  />
                );
              })}
            />
          </View>

        <View style={styles.body}>
          {/* Item details */}
          <View>
            <View style={styles.rating}>
              <View style={styles.ratingCount}>
                <Text style={styles.ratingText}>{Math.round(item.rating)}</Text>
                <Icon name="star" type="material" size={20} color="white" />
              </View>
              <Text style={{ marginHorizontal: 5 }}>
                {totalRatings} ratings
              </Text>
            </View>
            <View>
              <Text style={styles.title} variant="titleLarge">{toTitleCase(item.name.trim())}</Text>
            </View>
            <View style={styles.priceParent}>
              <Text style={styles.price} variant="titleLarge">{"\u20B9 " + (item.price - item.discount)}</Text>
              <Text style={{ ...styles.price, marginLeft: 20 }} variant="titleLarge">
                <Text style={styles.discount}>
                  {Math.floor(getPercentage(item.discount, item.price) * 1) + "% "}
                </Text>
                {"OFF"}
              </Text>
            </View>

            <View>
              <Text style={styles.totalPrice}>{"\u20B9 " + item.price}</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={styles.subtitle}>Store : </Text>
              <Text style={{ ...styles.subtitle, fontWeight: '500', fontSize: 16 }}>{storeName}</Text>
            </View>

            {item.capacity > 0 && (
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Text style={styles.subtitle}>Capacity : </Text>
                <Text style={{ ...styles.subtitle, fontWeight: '500', fontSize: 16 }}>{item.capacity} {item.itemSubCategory?.unit}</Text>
              </View>
            )}

            <View>
              <Text style={styles.subtitle}>Description : </Text>
              <ViewMoreText
                numberOfLines={3}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
              >
                <Text style={styles.description}>{item.description.trim()}</Text>
              </ViewMoreText>

              <Pressable style={{ justifyContent: 'center', alignItems: 'flex-end' }}
                onPress={() => navigation.navigate('addItemReview', { itemId: item.id })}>
                <Text style={{
                  color: 'blue',
                  marginHorizontal: 10
                }}>{userReview ? "Edit Review" : "Add a review"}</Text>
              </Pressable>
            </View>

            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Pressable
                onPress={handleAddToSlip}
                style={styles.button}
                accessibilityLabel="Learn more about this purple button"
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{"ADD TO SLIP"}</Text>
              </Pressable>
            </View>
          </View>

          {/* Item reviews */}
          <View>
            <Text style={styles.reviewsHeader}> {totalReviesElement} reviews</Text>
            {itemReviews.map((review: any, index) => {
              return (
                <UserReview review={review} key={index} onLike={handleLike} onDisLike={handleDisLike} />
              );
            })}
            {isFetchingMore && <ActivityIndicator size="large" color={themeColor} />}
          </View>
        </View>
      </ScrollView>
      <RatingModal modalVisible={modalVisible} setModalVisible={setModalVisible} handleRatingSubmit={handleRatingSubmit} />
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 15,
    paddingTop: 20,
    // opacity: 0.8
  },
  carousel : {
    backgroundColor: '#f5f9ff',
    padding : 0,
    margin : 0,
    flex : 1,
  },
  mainScroll: {
    backgroundColor: bodyColor,
    zIndex : 0,
    padding: 0,
    margin: 0, // Add margin: 0 to remove extra space
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
  },
  imageParent: {
    width: '100%',
    height: 300,
    padding: 0,
    margin : 0,
    zIndex : 0,
    backgroundColor : 'red'
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f9ff', 
    objectFit: 'cover'
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 'auto',
  },
  priceParent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    opacity: 0.8
  },
  discount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D6900',
  },
  totalPrice: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#939393',
    textDecorationLine: 'line-through'
  },
  rating: {
    float : 'right',
    display: 'flex',
    marginRight: 'auto',
    flexDirection: 'row',
    width: '100%',
    marginBottom : 10
  },
  ratingCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'green',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 2
  },
  subtitle: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: '700'
  },
  button: {
    borderRadius: 20,
    height: 45,
    width: '100%',
    backgroundColor: themeColor,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginVertical: 20
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentInput: {
    fontSize: 14,
    borderColor: 'gray',
    height: 50
  },
  commentInputBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: bodyColor
  },
  viewMoreLess: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  }
});

const mapToStateProps = (state: ApplicationState) => {
  return {
    isAuthenticated: !!state.userReducer.token,
    user: state.userReducer.user,
  };
};

export default connect(mapToStateProps)(ItemDetail);