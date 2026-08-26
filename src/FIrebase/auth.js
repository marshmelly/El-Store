import { getAuth } from 'firebase/auth'
import { app } from './config'
import {auth} from './config'
import {createUserWithEmailAndPassword} from 'firebase/auth'


export const auth = getAuth(app)