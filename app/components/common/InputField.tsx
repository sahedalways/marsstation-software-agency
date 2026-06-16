import { Lbl } from './Lbl';

interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
    mob: boolean;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export function InputField({
    label,
    placeholder,
    type = 'text',
    mob,
    value,
    error,
    onChange,
}: InputFieldProps) {
    return (
        <div>
            <Lbl mob={mob}>{label}</Lbl>

            <div style={{ position: 'relative' }}>
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${error ? '#ff4d4d' : 'rgba(255,255,255,0.10)'}`,
                        borderRadius: '8px',
                        padding: mob ? '6px 35px 6px 10px' : '9px 35px 9px 13px',
                        color: '#fff',
                        fontSize: mob ? '11px' : '12px',
                        outline: 'none',
                    }}
                />

                {error && (
                    <span
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#ff4d4d',
                            fontSize: '14px',
                        }}
                    >
                        ⚠
                    </span>
                )}
            </div>

            {error && (
                <p
                    style={{
                        color: '#ff4d4d',
                        fontSize: mob ? '10px' : '11px',
                        marginTop: '5px',
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
