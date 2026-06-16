export function Lbl({
    children,
    mob,
    style,
}: {
    children: React.ReactNode;
    mob: boolean;
    style?: React.CSSProperties;
}) {
    return (
        <label
            style={{
                display: 'block',
                fontSize: mob ? '9.5px' : '11px',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: mob ? '4px' : '6px',
                letterSpacing: '0.03em',
                ...style,
            }}
        >
            {children}
        </label>
    );
}
