// import classnames from 'classnames';
import { 
    Formik, 
    Form, 
    Field,
    ErrorMessage,
    FieldProps,
    FieldArray,
    FastField,
    FormikProps,
    FormikHelpers,
} from 'formik';
import * as yup from 'yup';
import styles from './styles.module.scss';
import MyErrorMessage from '../../components/MyErrorMessage';

interface IValuesProps {
    name: string;
    email: string;
    channel: string;
    comment: string;
    address: string;
    social: {
        facebook: string;
        twitter: string;
    },
    phoneNumbers: string[];
}

function SimpleFormExample9() {
    const initialValues: IValuesProps = {
        name: '',
        email: '',
        channel: '',
        comment: '',
        address: '',
        social: {
            facebook: '',
            twitter: '',
        },
        phoneNumbers: [],
    };

    const onSubmit = (
        values: IValuesProps, 
        onSubmitProps: FormikHelpers<IValuesProps>,
    ) => {
        console.log('Form values', values);
        // Имитация задержки ответа сервера после которого нужно разблокировать кнопку
        setTimeout(() => onSubmitProps.setSubmitting(false), 1000);
    };

    const validationSchema = yup.object({
        name: yup.string().required('Required'),
        email: yup.string().email('Invalid email format').required('Required'),
        channel: yup.string().required('Required'),
        address: yup.string().required('Required'),
        social: yup.object({
            facebook: yup.string().required('Required'),
            twitter: yup.string().required('Required'),
        }),
        // Содержат ли значения массива phoneNumbers строки с заполненными значениями
        phoneNumbers: yup.array().of(yup.string().required('Required')),
    });

    // Пример валидации на уровне поля: шаг 1 - определяем функцию валидации поля
    const validateComment = (value: string) => {
        let error;
        if(!value) {
            error = 'Required (this is validation at the field level)';
        }
        return error;
    }

    const handleValidateField = (
        formik: FormikProps<IValuesProps>, 
        fieldName: string
    ) => {
        formik.setFieldTouched(fieldName);
        formik.validateField(fieldName);
    };

    const handleValidateAll = (
        formik: FormikProps<IValuesProps>,
        fieldNames: Partial<Record<keyof IValuesProps, boolean | boolean[] | {
            facebook: boolean;
            twitter: boolean;
        }>>,
    ) => {
        // @ts-ignore
        formik.setTouched(fieldNames);
        formik.validateForm();
    };


    return (
        <div className={styles.formWrap}>
            <h1>Форма 9</h1>

            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
                // validateOnMount запустит проверку формы (обернутую в Formik)
                // при ее монтировании и/или когда изменяются начальные значения
                // Этот вариант подходит для формы с небольшим количеством полей
                // поэтому закомментируем его и используем второй вариант проверки
                // смотри блокировку кнопки с использованием свойства formik.dirty
                // validateOnMount
            >
                {
                    (formik: FormikProps<IValuesProps>) => {
                        
                        return (
                            <Form>
                                <div className='form-control'>
                                    <label htmlFor='name'>Name</label>
                                    <FastField
                                        type='text'
                                        id='name'
                                        name='name'
                                        placeholder='Введите имя'
                                    />
                                    {/* ErrorMessage - компонент, который отображает сообщение об ошибке для поля, если 
                                    оно было посещено и присутствует сообщение об ошибке. В данном случае, валидируемое
                                    поле связывается с ErrorMessage через указание значения в атрибуте name */}
                                    {/* Первый вариант вывода ошибки */}
                                    <ErrorMessage component="div" name='name' className='error'/>
                                </div>

                                <div className='form-control'>
                                    <label htmlFor='email'>E-mail</label>
                                    <FastField
                                        type='email'
                                        id='email'
                                        name='email'
                                        placeholder='Введите email'
                                    />
                                    {/* Второй вариант вывода ошибки */}
                                    <ErrorMessage name='email'>
                                        {(msg) => <div className='error'>{msg}</div>}
                                    </ErrorMessage>
                                </div>

                                {/* FastField: по умолчанию создаст input */}
                                <div className='form-control'>
                                    <label htmlFor='channel'>Channel</label>
                                    <FastField
                                        type='text'
                                        id='channel'
                                        name='channel'
                                        placeholder='Укажите ссылку на канал'
                                    />
                                    {/* Третий вариант вывода ошибки */}
                                    <ErrorMessage 
                                        render={(msg) => <div className='error'>{msg}</div>} 
                                        name='channel'
                                    />
                                </div>

                                {/* FastField: первый способ задания HTML-элемента отличного от input: as='' */}
                                <div className='form-control'>
                                    <label htmlFor='comment'>Comment</label>
                                    <FastField
                                        as='textarea'
                                        id='comment'
                                        name='comment'
                                        placeholder='Добавьте комментарий'
                                        // Пример валидации на уровне поля: шаг 2 - добавляем свойство validate
                                        validate={validateComment}
                                    />
                                    {/* Использование кастомного компонента ошибки вместо третьего варианта вывода ошибки */}
                                    <MyErrorMessage name="comment"/>
                                </div>

                                {/* FastField: второй способ задания HTML-элемента отличного от input: children */}
                                <div className='form-control'>
                                    <label htmlFor='address'>Address</label>
                                    <FastField name='address'>
                                        {
                                            ({field, form, meta}: FieldProps): React.ReactNode => {
                                                return (
                                                <>
                                                        <input type="text" id="address" {...field} />
                                                        {meta.touched && meta.error
                                                            ? <div className='error'>{meta.error }</div>
                                                            : null
                                                        }
                                                    </> 
                                                )
                                            }
                                        }
                                    </FastField>
                                </div>

                                {/* Поля для вложенного объекта */}
                                <div className='form-control'>
                                    <label htmlFor='facebook'>Профиль в facebook</label>
                                    <FastField
                                        type='text'
                                        id='facebook'
                                        name='social.facebook'
                                        placeholder='Укажите ссылку на facebook'
                                    />
                                    <MyErrorMessage name="social.facebook" />
                                </div>

                                <div className='form-control'>
                                    <label htmlFor='twitter'>Профиль в twitter</label>
                                    <FastField
                                        type='text'
                                        id='twitter'
                                        name='social.twitter'
                                        placeholder='Укажите ссылку на twitter'
                                    />
                                    <MyErrorMessage name="social.twitter" />
                                </div>

                                {/* Поля массива номеров */}
                                <div className='form-control'>
                                    <label htmlFor='primaryPh'>Список телефонных номеров</label>
                                    <FieldArray name='phoneNumbers'>
                                        {
                                            ({push, insert, remove, form: {values, errors}}) => {
                                                const phoneNumbers: string[] = values.phoneNumbers;

                                                return <>
                                                    { phoneNumbers && phoneNumbers.length > 0 
                                                        ? (
                                                            phoneNumbers.map((_, idx) => (
                                                                <div key={idx}>
                                                                    {/* Оставил здесь Field так как непонятно приносит ли здесь пользу компонент 
                                                                    FastField или нет, количество отрисовок (renders) осталось без изменений */}
                                                                    <Field name={`phoneNumbers.${idx}`} />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => remove(idx)}
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => insert(idx, '')}
                                                                    >
                                                                        +
                                                                    </button>
                                                                    <MyErrorMessage name={`phoneNumbers.${idx}`} />
                                                                </div>
                                                            ))
                                                        )
                                                        : (
                                                            <button type="button" onClick={() => push('')}>
                                                            Add a phone number
                                                            </button>
                                                        )
                                                    }
                                                </>;
                                            }
                                        }
                                    </ FieldArray>
                                </div>

                                <button 
                                    type='button'
                                    onClick={() => handleValidateField(formik, 'comment')}
                                >
                                    Visit and validate comment
                                </button>

                                <button 
                                    type='button'
                                    onClick={() => handleValidateAll(formik, {
                                        name: true,
                                        address: true,
                                        channel: true,
                                        // comment: true,
                                        email: true,
                                        social: {
                                            facebook: true,
                                            twitter: true,
                                        },
                                        phoneNumbers: formik.values.phoneNumbers.map(() => true),
                                    })}
                                >
                                    Visit and validate all (without comment)
                                </button>

                                {/* Варианты блокировки кнопки отправки формы */}
                                {/* 1. Вариант блокировки кнопки совместно с использование 
                                    поля validateOnMount в компоненте Formik */}
                                {/* <button 
                                    type='submit'
                                    disabled={!formik.isValid}
                                >
                                    Submit
                                </button> */}

                                {/* 2. Этот вариант блокировки подходит только для случая, когда
                                пользователь будет точно менять значение хотя бы одного из полей.
                                В противном случае кнопка останется заблокированной  */}
                                {/* <button
                                    type='submit'
                                    // свойство dirty контролирует изменение в полях формы
                                    disabled={!(formik.dirty && formik.isValid)}
                                >
                                    Submit
                                </button> */}

                                {/* Усовершенствованный вариант 2: кнопка также блокируется после
                                    того как она была нажата до момента получения ответа с сервера
                                    (разблокировка определена выше в методе onSubmit) */}
                                <button
                                    type='submit'
                                    disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                                >
                                    Submit
                                </button>
                            </Form>
                        );
                    }
                }
                
            </Formik>
        </div>
    );
}

export default SimpleFormExample9;
