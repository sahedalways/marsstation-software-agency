'use client';

interface Props {
    open: boolean;
    mob: boolean;
    type?: 'success' | 'error';
    title?: string;
    message?: string;
    buttonText?: string;
    onClose: () => void;
}

export function ToastMsgModal({
    open,
    mob,
    type = 'success',
    title,
    message,
    buttonText = 'Close',
    onClose,
}: Props) {
    if (!open) return null;

    const isSuccess = type === 'success';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,.65)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px',
            }}
        >
            <div
                style={{
                    width: mob ? '90%' : '420px',
                    padding: '35px 30px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    background: 'linear-gradient(145deg,#ffffff,#eef0ff)',
                    boxShadow: '0 30px 80px rgba(90,40,200,.35)',
                    animation: 'modalScale .35s ease',
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        width: '65px',
                        height: '65px',
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        color: '#fff',

                        background: isSuccess
                            ? 'linear-gradient(135deg, #732aeb, #5a1ec8)'
                            : 'linear-gradient(135deg,#ff4d4d,#c1121f)',
                        boxShadow: isSuccess
                            ? '0 10px 30px rgba(115,42,235,.35)'
                            : '0 10px 30px rgba(255,77,77,.35)',
                    }}
                >
                    {isSuccess ? '✓' : '!'}
                </div>

                <h3
                    style={{
                        color: '#10162f',
                        fontSize: mob ? '20px' : '24px',
                        marginBottom: '10px',
                        fontWeight: 600,
                    }}
                >
                    {title}
                </h3>

                <p
                    style={{
                        color: '#4b5563',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        marginBottom: '25px',
                    }}
                >
                    {message}
                </p>

                <button
                    onClick={onClose}
                    style={{
                        padding: '11px 30px',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        background: isSuccess
                            ? 'linear-gradient(135deg, #732aeb, #5a1ec8)'
                            : 'linear-gradient(135deg,#ff4d4d,#c1121f)',
                        fontSize: '14px',
                        transition: '.25s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    {buttonText}
                </button>
            </div>

            <style>
                {`
                    @keyframes modalScale {
                        from {
                            opacity:0;
                            transform:scale(.85);
                        }

                        to {
                            opacity:1;
                            transform:scale(1);
                        }
                    }
                `}
            </style>
        </div>
    );
}
