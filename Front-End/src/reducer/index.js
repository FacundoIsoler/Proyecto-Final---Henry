//import {} from "../actions/index"

import { GET_DETAILS, GET_SUPPLIERS, ADD_CART, REMOVE_ITEM, SHOW_CART, SUMTOTALPRICE, RESTOTALPRICE, GET_TOTAL, ADD_AMOUNT, ADD_PRICE_CART, DELETE_SERVICE_AMOUNT, CART_RESTORE } from "../Constantes/Constantes";

const initialState = {
  services: [],
  serviceDetails: [],
  allServices: [],
  suppliers: [],
  supplierDetails: [],
  searchingType: "",
  searching: false,
  categories: [],
  cart: [],
  location: [],
  loading: true,
  users: [],
  contracts: [],
  userDetails: [],
  userLog: [],
  contractDetails: [],
userDB:{},
totalPrice: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case 'SET_SERVICES':
    return {
      ...state,
      allServices: action.payload,
      loading: false,
    }

    case 'ADD_SERVICES':
      return {
        ...state,
        services: action.payload,
      }

    case GET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
        loading: false,
      }
    case GET_DETAILS:
      return {
        ...state,
        supplierDetails: action.payload
      }
    case 'SEARCHING_TRUE':
      return {
        ...state,
        searching: true
      }

    case 'SEARCHING_FALSE':
      return {
        ...state,
        searching: false
      }

    case 'FILL_SUPPLIERS':
      return {
        ...state,
        suppliers: action.payload
      }

    case 'SEARCHING_SERVICES':
      return {
        ...state,
        searchingType: "services"
      }

    case 'SEARCHING_SUPPLIERS':
      return {
        ...state,
        searchingType: "suppliers"
      }

    case "GET_CATEGORIES":
      return {
        ...state,
        categories: action.payload
      }
     
    case "GET_LOCATIONS":
      return {
        ...state,
        location: action.payload
      }

    case "FILTER_BY_CATEGORY":
      return {
        ...state,
        services: action.payload
      }

    case "FILTER_BY_LOCATION":
      return {
        ...state,
        services: action.payload
      }

    case ADD_CART:
      let item = action.payload
      let id = item.id
      localStorage.setItem(id, JSON.stringify(item))
      let services = JSON.parse(localStorage.getItem(id))
      console.log(localStorage)

    
 
      return {
        ...state,
        cart: [...state.cart, services]
        
      }
    case REMOVE_ITEM:
      // let filterCart = state.cart.filter(item => item.id !== action.payload)
      localStorage.removeItem(action.payload)
      const allKeys = Object.keys(localStorage);
    const localStorageMap = allKeys.map((key) =>
      localStorage.getItem(key)
    );
    const localStorageFilter = localStorageMap.filter(e=> e.includes("serviceType"))
    const localStorageMaping= localStorageFilter.map(e=> JSON.parse(e))
      let newCart = localStorageMaping
      return {
        ...state,
        cart: newCart

      }

    case "SERVICE_DETAIL":
      return {
        ...state,
        serviceDetails: action.payload
      }
    case SHOW_CART:
      return{
        ...state,
        cart: action.payload
      } 
      case 'USER_BY_ID':
        return {
          ...state,
          userDB: action.payload
        }
        case 'UPLOAD_IMAGE_PROFILE':
          return {
            ...state,
            userDB: action.payload
          }
        case 'GET_ALL_USERS':
          return {
            ...state,
            users: action.payload
          }
        case 'GET_ALL_CONTRACTS':
          return {
            ...state,
            contracts: action.payload
          }
        case 'GET_USER_BY_ID':
          return {
            ...state,
            userDetails: action.payload
          }
        case 'GET_USER_LOG':
          return {
            ...state,
            userLog: action.payload
          }

        case SUMTOTALPRICE:
          let suma = action.payload
          let auxSum = JSON.parse(localStorage.getItem(suma))
          let totalSum = state.totalPrice + Number(auxSum.pricePerHour)
          localStorage.setItem("total", JSON.stringify(totalSum))
          // let totalSum = JSON.parse(localStorage.getItem("total"))

          return {
            ...state,
            totalPrice: state.totalPrice + Number(auxSum.pricePerHour)
          }
          case RESTOTALPRICE:
            let resta = action.payload    
            let auxRest = JSON.parse(localStorage.getItem(resta))  
            let totalRest =  state.totalPrice - Number(auxRest.pricePerHour)
            localStorage.setItem("total", JSON.stringify(totalRest))
            // let totalRest = JSON.parse(localStorage.getItem("total"))
            
    
          return {
            ...state,
            totalPrice: state.totalPrice - Number(auxRest.pricePerHour)
            } 
            case GET_TOTAL:
              // let total = state.totalPrice
              let total = JSON.parse(localStorage.getItem("total"))
              // let totalMap = localStorage.map((e) => {return console.log(e)} )
             
              return{
                ...state,
                totalPrice: total
                        }

              case ADD_PRICE_CART:
                let getTotal = JSON.parse(localStorage.getItem("total"))
                let auxAPC = Number(getTotal) + Number(action.payload)
                localStorage.setItem("total", JSON.stringify(auxAPC))
               let newtotal = JSON.parse(localStorage.getItem("total"))
               console.log(newtotal)
              return {
                  ...state,
                  // totalPrice: newtotal
              }          

             case ADD_AMOUNT:
           
              let amountCostumer = action.amount
              let id2 = action.id
              let services2 = JSON.parse(localStorage.getItem(id2)) 
              services2.amount += amountCostumer
              let newTotal = Number(services2.amount)*Number(services2.pricePerHour)
              console.log(newTotal)
              localStorage.setItem(id2, JSON.stringify(services2))
              let found = state.cart.find(e => e.id === id2)
              let index = state.cart.indexOf(found)
              state.cart[index].amount = services2.amount
         
              


         
              return {
                ...state,
                cart: [...state.cart]
                
              }     
              
          
              case DELETE_SERVICE_AMOUNT:
                let restaService = action.payload
                let getLHTotal = JSON.parse(localStorage.getItem("total"))   
               
                let afterRest = Number(getLHTotal) - Number(restaService)
                localStorage.setItem("total", JSON.stringify(afterRest))
                let deleteTotal = JSON.parse(localStorage.getItem("total"))
              return {
                ...state,
                totalPrice: deleteTotal
              }
              case CART_RESTORE:
                localStorage.setItem("total", JSON.stringify(0))
                let restorTotal = JSON.parse(localStorage.getItem("total"))
                return{
                  ...state,
                  totalPrice: restorTotal
                }
      case "GET_CONTRACT_DETAILS":
        return {
          ...state,
          contractDetails: action.payload
        }

    default:
      return state;
  }
};

export default reducer;
