import Link from 'next/link'

const reg = (isLeader) => <li className={isLeader ? 'leader' : 'member'}>
  <input type='text' placeholder='姓名'/>(必填)
  <input type='text' placeholder='Email'/>(必填)
  <input type='text' placeholder='綽號'/>
  <input type='text' placeholder='電話'/>
  <input type='text' placeholder='偏好的選手號碼 (1~999)'/>
</li>

const Register = ({events, submitEvent}) => <div>
  <style jsx>{`

  `}</style>
    <div>
      <form>
        <ul>
          <li className='team'>
            <input type='text' placeholder='隊伍名' />(必填)
            <input type='text' placeholder='簡介' />
          </li>
        </ul>
      </form>
    </div>
</div>

export default Register
