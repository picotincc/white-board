export const REMOTE_OPERATION = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement'
}

export const OPERATION_TYPE = {
  SELECT: 'select',
  DRAW_LINE: 'line',
  DRAW_SHAPE: 'shape',
  CLEAR: 'clear',
  CLEAR_ALL: 'clear_all',
  INSERT_PIC: 'insert_pic',
  TEXT: 'text',
  DROP_PIC: 'drop_pic',
  UNDO: 'undo',
  REDO: 'redo'
}

export const CURSOR_MAP = {
  SELECT: 'select',
  PENCIL: 'pencil',
  RECT: 'rect'
}

const msgDataStruts = {
  id: 'v4', // v4 生成 uuid
  uid: 12123, // stream id
  timestamp: 321312, // 发送的时间
  op: OPERATION_TYPE.DRAW_LINE, // 操作类型
  data: {} // 不同操作有不同的数据
}
