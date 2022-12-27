                {/*<input type='text' placeholder="Class Name" onChange={(e)=> setStudClassName(e.target.value)}/>
                <br/>
                <select onChange={(e) => setStudClassTeacher(e.target.value)}>
                    {teachers.map( ({name,id}) => {
                    return (
                        <option value={id}>{name}</option>
                            )
                }) }
                </select>
                <br/>
                <button type='button' className="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline bg-blue-600 text-white hover:bg-blue-700" onClick={createStudClass}>Submit</button>
                            */}
                            const createStudClass = () => {
                                let form_data = new FormData();
                                form_data.append('name',studClassName);
                                form_data.append('teacher',studClassTeacher);
                                axiosInstance
                                .post('studclass/',form_data)
                                .then(res => {
                                    console.log(res.data)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                            }