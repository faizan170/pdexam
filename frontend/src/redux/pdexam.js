import { createSlice } from '@reduxjs/toolkit'



export const PDExam = createSlice({
  name: 'pdexam',
  initialState: {
    screen: 'init', // init, test, submit
    current_test_index : 0,
    pin_id: null,
    test_data: [
      { title: 'Arm at rest', id: 'arm_at_rest', type: 'arm' },
      { title: 'Outstretched Arm', id: 'outstretched_arm', type: 'arm' },
      { title: 'Finger Tapping', id: 'finger_tapping', type: 'arm' },
      { title: 'Hand Open-Close', id: 'hand_open_close', type: 'arm' },
      { title: 'Elbow Flexion', id: 'elbow_flexion', type: 'arm' },
      { title: 'Leg at Rest', id: 'leg_at_rest', type: 'leg' },
      { title: 'Outstretched Leg', id: 'outstretched_leg', type: 'leg' },
      { title: 'Toe Tapping', id: 'toe_tapping', type: 'leg' },
      { title: 'Heel Tapping', id: 'heel_tapping', type: 'leg' },
      { title: 'Knee Flexion', id: 'knee_flexion', type: 'leg' },
    ],
    questions: [
        
    ],
    tutorial: "https://www.youtube.com/embed/a9__D53WsUs",
    data: {
        test: {
            arm_at_rest: {
                left: null,
                right: null
            },
            outstretched_arm: {
                left: null,
                right: null
            },
            finger_tapping: {
                left: null,
                right: null
            },
            hand_open_close: {
                left: null,
                right: null
            },
            elbow_flexion: {
                left: null,
                right: null
            },
            leg_at_rest: {
                left: null,
                right: null
            },
            outstretched_leg: {
                left: null,
                right: null
            },
            toe_tapping: {
                left: null,
                right: null
            },
            heel_tapping: {
                left: null,
                right: null
            },
            knee_flexion: {
                left: null,
                right: null
            }
        }
    }
  },
  reducers: {
    setCurrentScreen: (state, action) => {
      state.screen = action.payload
    },
    setFormData: (state, action) => {
        state.data[action.payload.key] = action.payload.value
    },
    setCurrentIndex: (state, action) => {
        state.current_test_index = action.payload
    },
    setData: (state, action) => {
        state[action.payload.key] = action.payload.value
    },
    setTestRecording: (state, action) => {
        console.log(action.payload)
        state.data.test[action.payload.id] = {
            ...state.data.test[action.payload.id],
            [action.payload.type] : action.payload.data
        }
    },
    setInitialData:(state, action) => {
        state.test_data = action.payload.test_data
        state.data = {...state.data, test: action.payload.data}
        state.questions = action.payload.questions
        state.tutorial = action.payload.tutorial
    }
  }
}) 

export const { setCurrentScreen, setFormData, setCurrentIndex, setTestRecording, setData, setInitialData } = PDExam.actions

export default PDExam.reducer