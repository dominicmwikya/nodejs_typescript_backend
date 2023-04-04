import React,{useContext}from 'react'
import { AuthContext } from '../../ContextAPI/authContextAPI'
export const ProductForm=({handleSubmit, handleValueChange, values}) =>{
    const {user}=useContext(AuthContext)
  return (
    <form className='form-inline' onSubmit={handleSubmit} >
        <div className='form-group row'>
            <div className='col'>
          

                <div className="input-group mb-2">
                    <input  className="form-control" 
                            type="text" 
                            name="name" 
                            placeholder="item name" 
                             onChange={handleValueChange}
                             value={values.name}
                             />
                </div> 
            </div>
            
            <div className='col'>
                <div className="input-group mb-2"> 
                <select name='category' className='form-control'  onChange={handleValueChange}  value={values.category}>
                    <option> Please select category</option>
                    <option value='charger'>charger</option>
                    <option value='phone'>phone</option>
                    <option value='laptop'>laptop</option>
                </select>
                </div> 
            </div>
        </div>
        <div className='form-group row'>
        <div className='col'>
            <div className="input-group mb-2"> 
                <input  className="form-control" 
                    type="number" 
                    name="min_qty" 
                    placeholder="min item qty" 
                    onChange={handleValueChange}
                    value={values.min_qty}
                    />
            </div> 
        </div>

        <div className='col'>
            <div className="input-group mb-2">
                <select className='form-control' name="unit" 
                 onChange={handleValueChange}
                 value={values.unit}
                 >
                    <option defaultValue>Select Unit</option>
                    <option value="piece">Piece</option>
                    <option value="kg">Kg</option>
                </select>
            </div> 
        </div>
            
        </div>
        <div className='form-group row'>
            <div className='col'>
                <div className="input-group mb-2">
                    <input  className="form-control" 
                            type="textarea" 
                            name="description" 
                            placeholder="Item description" 
                            onChange={handleValueChange}
                            value={values.description}
                            />
                </div> 
            </div>
        </div>
        
        <div className='form-group row'>
            <input  className="btn btn-success" 
                    type="submit" 
                    value="Add Item"
                    style={{textShadow:"none", 
                    height:'40px',
                    width:"150px",
                    color:'white', 
                    borderRadius:"10px",
                    textCenter:"center",
                    marginLeft:'50%',
                    display: "flex", alignItems: "center", justifyContent: "center" 
                }}
                />
        </div> 
    </form>
  )
}
